// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --

import { ethers } from "ethers";

let db, contract, signer;

const CHAIN_ID = 1;
const DELEGATION_INTERVAL = 7776000; // 90 days
// const DELEGATION_INTERVAL = 60;
const TOKEN_ADDRESS = "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72";
const ABI = [
  "function balanceOf(address addr) public view returns (uint256)",
  "function delegateBySig(address delegatee, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s) public",
  "function nonces(address owner) public view returns (uint256)",
];
const MIN_BALANCE = ethers.utils.parseEther("1");

function addressAllowed(address) {
  return true;
}

async function nextTimestamp(address) {
  if (!addressAllowed(address)) {
    return undefined;
  }
  console.log("address allowed", address);
  const balance = await contract.balanceOf(address);
  console.log("balance is:", balance);
  if (balance.lt(MIN_BALANCE)) {
    return undefined;
  }
  console.log("has enough balance");
  const now = Math.floor(Date.now() / 1000);
  const doc = db.accounts[address.toLowerCase()];
  if (!doc) {
    return 0;
  }
  return doc.expires;
}

async function handleQuery(params) {
  const { address } = params;
  const next = await nextTimestamp(address);
  if (next === undefined) {
    return null;
  }
  const nonce = (await contract.nonces(address)).toNumber();
  return { next, nonce };
}

async function handleDelegate(params) {
  const { delegatee, nonce, expiry, v, r, s } = params;
  const address = await ethers.utils.verifyTypedData(
    {
      name: "Ethereum Name Service",
      version: "1",
      chainId: CHAIN_ID,
      verifyingContract: TOKEN_ADDRESS,
    },
    {
      Delegation: [
        { name: "delegatee", type: "address" },
        { name: "nonce", type: "uint256" },
        { name: "expiry", type: "uint256" },
      ],
    },
    { delegatee, nonce, expiry },
    { v, r, s }
  );
  console.log(address);
  const now = Math.floor(Date.now() / 1000);
  const next = await nextTimestamp(address);
  if (next === undefined) {
    throw new Error(`Signer ${address} cannot send delegation meta-tx`);
  } else if (next > now) {
    throw new Error(
      `Signer ${address} cannot send delegation meta-tx until ${next}`
    );
  }
  db.accounts[address.toLowerCase()] = {
    expires: now + DELEGATION_INTERVAL,
  };
  Cypress.env("db", db);
  const tx = await contract.delegateBySig(delegatee, nonce, expiry, v, r, s, {
    gasPrice: "0",
  });
  return tx.hash;
}

async function handleDelegateRequest(req) {
  const response = {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };

  console.log(contract);
  console.log("req: ", req);

  if (req.method === "OPTIONS") {
    response.headers["Access-Control-Allow-Methods"] = "POST";
    response.headers["Access-Control-Allow-Headers"] = "Content-Type";
    response.headers["Access-Control-Max-Age"] = "3600";
    response.statusCode = 204;
    response.body = "";
    return response;
  } else if (req.method !== "POST") {
    response.statusCode = 405;
    response.body = "";
    return response;
  }

  const { id, method, params } = req.body;
  try {
    let result;
    switch (method) {
      case "query":
        result = await handleQuery(params);
        break;
      case "delegate":
        result = await handleDelegate(params);
        break;
      default:
        response.body = {
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: "Unknown method" },
        };
        return response;
    }
    response.body = { jsonrpc: "2.0", id, result };
    return response;
  } catch (e) {
    response.body = {
      jsonrpc: "2.0",
      id,
      error: { code: -32603, message: `Server error: ${e.message}` },
    };
    return response;
  }
}

Cypress.Commands.add("interceptDelegateBySig", () => {
  db = Cypress.env("DELEGATE_WALLET").db;
  const { wallet, forkId } = Cypress.env("DELEGATE_WALLET");
  const rpcUrl = `https://rpc.tenderly.co/fork/${forkId}`;

  console.log(wallet, rpcUrl);

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl, CHAIN_ID);
  signer = new ethers.Wallet(wallet, provider);
  contract = new ethers.Contract(TOKEN_ADDRESS, ABI, signer);

  Cypress.config("defaultCommandTimeout", 20000);
  cy.intercept(
    "https://us-central1-ens-delegator.cloudfunctions.net/delegate",
    async (req) => {
      req.responseTimeout = 20000;
      req.reply(await handleDelegateRequest(req));
    }
  );
});
