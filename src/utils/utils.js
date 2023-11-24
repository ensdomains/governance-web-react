import { gql } from "graphql-tag";
import { apolloClientInstance } from "../apollo";
import {
  generateMerkleShardUrl,
  getDelegateRpcURL,
  networkIdToName,
  supportedAvatarProtocols,
} from "./consts";

export const formatTokenAmount = (tokenAmount, length = 6) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: length,
    maximumFractionDigits: length,
  }).format(Number(tokenAmount) / Math.pow(10, 18));

export function imageUrl(url, name, networkId) {
  const _network = networkIdToName(networkId);
  const _protocol = supportedAvatarProtocols.find((proto) =>
    url.startsWith(proto)
  );
  // check if given uri is supported
  // provided network name is valid,
  // domain name is available
  if (_protocol && _network && name) {
    return `https://metadata.ens.domains/${_network}/avatar/${name}`;
  }
  console.warn("Unsupported avatar", _network, name, url);
}

export const shortenAddress = (
  address = "",
  maxLength = 10,
  leftSlice = 5,
  rightSlice = 5
) => {
  if (address.length < maxLength) {
    return address;
  }

  return `${address.slice(0, leftSlice)}...${address.slice(-rightSlice)}`;
};

const LABELHASH_QUERY = gql`
  query domainByLabelhash($labelhash: [String], $parenthash: [String]) {
    domains(where: { labelhash_in: $labelhash, parent_in: $parenthash }) {
      name
      labelhash
    }
  }
`;

export const getClaimData = async (address, type = "mainnet") => {
  const response = await fetch(generateMerkleShardUrl(address, type));
  if (!response.ok) {
    throw new Error("error getting shard data");
  }
  const shardData = await response.json({ encoding: "utf-8" });
  const addressDetails = shardData?.entries[address];

  if (addressDetails && type !== "mainnet") {
    const balance = formatTokenAmount(addressDetails?.balance);
    const shortBalance = formatTokenAmount(addressDetails?.balance, 2);

    return {
      balance,
      shortBalance,
      rawBalance: addressDetails?.balance,
      eligible: true,
    };
  }

  if (addressDetails) {
    const { data } = await apolloClientInstance.query({
      query: LABELHASH_QUERY,
      variables: {
        labelhash: [
          addressDetails?.last_expiring_name ?? "",
          addressDetails?.longest_owned_name,
        ],
        parenthash: [
          "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
        ],
      },
    });

    const longestOwnedName = data?.domains.find(
      (x) => x.labelhash === addressDetails?.longest_owned_name
    )?.name;
    const lastExpiringName = data?.domains.find(
      (x) => x.labelhash === addressDetails?.last_expiring_name
    )?.name;
    const pastTokens = formatTokenAmount(addressDetails?.past_tokens, 2);
    const futureTokens = formatTokenAmount(addressDetails?.future_tokens, 2);
    const balance = formatTokenAmount(addressDetails?.balance);
    const shortBalance = formatTokenAmount(addressDetails?.balance, 2);

    return {
      lastExpiringName,
      longestOwnedName,
      pastTokens,
      futureTokens,
      balance,
      shortBalance,
      hasReverseRecord: addressDetails?.has_reverse_record,
      rawBalance: addressDetails?.balance,
      eligible: true,
    };
  }

  return {
    eligible: false,
  };
};

export const parseAndUseAirdrop = (jsonString) => {
  try {
    const airdropString = jsonString.items?.airdrop || jsonString.airdrop;

    if (airdropString) {
      console.log("Original airdrop string:", airdropString);

      // Replace single quotes with double quotes
      const correctedAirdropString = airdropString.replace(/'/g, '"');
      console.log("Corrected airdrop string:", correctedAirdropString);

      // Attempt to parse the corrected "airdrop" field content as JSON
      const parsedAirdrop = JSON.parse(correctedAirdropString);
      console.log("Parsed airdrop:", parsedAirdrop);

      return parsedAirdrop.string2;
    } else {
      console.error('No valid "airdrop" field found');
      return null;
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
};

export const sendToDelegateJsonRpc = async (method, params) => {
  return fetch(getDelegateRpcURL(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method,
      params,
      id: 1,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        throw new Error(res.error.message);
      }
      return res.result;
    });
};

export const getCanDelegateBySig = async (address) => {
  const delegateSigData = await sendToDelegateJsonRpc("query", {
    address,
  });
  const currentDate = Date.now();

  if (delegateSigData && delegateSigData.next !== undefined) {
    if (delegateSigData.next * 1000 < currentDate) {
      delegateSigData.canSign = true;
    } else {
      delegateSigData.canSign = false;
      const dateFromNext = new Date(delegateSigData.next * 1000);
      const distance = dateFromNext - currentDate;
      if (distance < 7200000) {
        delegateSigData.formattedDate =
          "in " + (distance / 1000 / 60).toFixed() + " minutes";
      } else if (distance < 259200000) {
        delegateSigData.formattedDate =
          "in " + (distance / 1000 / 3600).toFixed() + " hours";
      } else {
        delegateSigData.formattedDate =
          "on " + dateFromNext.toLocaleDateString();
      }
    }
  }

  return delegateSigData;
};
