const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const merkleAirdrop = require("../fixtures/merkleAirdropContract.json");

const baseUrl = process.env.CYPRESS_TENDERLY_PROJECT;
const key = process.env.CYPRESS_TENDERLY_KEY;

module.exports = (on) => {
  on("task", {
    createMerkleFork() {
      let forkId;
      let contract;
      return fetch(baseUrl, {
        method: "POST",
        headers: {
          "x-access-key": key,
        },
        body: JSON.stringify({ network_id: "1", alias: "", description: "" }),
      })
        .then((res) => res.json())
        .then((res) => {
          forkId = res.simulation_fork.id;
          process.env.RPC_URL = `https://rpc.tenderly.co/fork/${forkId}`;
        })
        .then(() =>
          fetch(baseUrl + "/" + forkId + "/accounts", {
            method: "POST",
            headers: {
              "x-access-key": key,
            },
            body: JSON.stringify(merkleAirdrop),
          })
        )
        .then((res) => res.json())
        .then((res) => (contract = res.contracts[0]))
        .then(() =>
          fetch(baseUrl + "/" + forkId + "/simulate", {
            method: "POST",
            headers: {
              "x-access-key": key,
            },
            body: JSON.stringify({
              from: "0xfe89cc7abb2c4183683ab71653c4cdc9b02d44b7",
              gas: 8000000,
              gas_price: "0",
              input: `0x095ea7b3000000000000000000000000${contract.address.slice(
                2
              )}00000000000000000000000000000000000000000014adf4b7320334b9000000`,
              network_id: "1",
              save: true,
              to: "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72",
              transaction_index: null,
              value: "0",
            }),
          })
        )
        .then((res) => res.json())
        .then(() => (process.env.MERKLE_AIRDROP = contract.address))
        .then(() => (console.log(contract.address), console.log(forkId)))
        .then(() => contract.address);
    },
  });
};
