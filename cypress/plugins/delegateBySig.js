const { ethers } = require("ethers");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = (on) => {
  on("task", {
    async setupDelegateWallet(forkId) {
      const db = {
        accounts: {},
      };

      const wallet = ethers.Wallet.createRandom();

      await fetch(
        process.env.CYPRESS_TENDERLY_PROJECT + "/" + forkId + "/simulate",
        {
          method: "POST",
          headers: {
            "x-access-key": process.env.CYPRESS_TENDERLY_KEY,
          },
          body: JSON.stringify({
            access_list: [],
            alias: "",
            block_number: null,
            description: "",
            from: "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72",
            gas: 8000000,
            gas_price: "0",
            generate_access_list: true,
            input: `0xa9059cbb000000000000000000000000${wallet.address.substring(
              2
            )}0000000000000000000000000000000000000000000000008ac7230489e80000`,
            network_id: "1",
            save: true,
            to: "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72",
            transaction_index: null,
            value: "0",
          }),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          return fetch(
            process.env.CYPRESS_TENDERLY_PROJECT + "/" + forkId + "/simulate",
            {
              method: "POST",
              headers: {
                "x-access-key": process.env.CYPRESS_TENDERLY_KEY,
              },
              body: JSON.stringify({
                access_list: [],
                alias: "",
                block_number: null,
                description: "",
                from: "0x2ef2c9f9DaA42f56B393e36F8376C93313fe1B1e",
                gas: 8000000,
                gas_price: "0",
                generate_access_list: true,
                input:
                  "0x095ea7b30000000000000000000000002ef2c9f9DaA42f56B393e36F8376C93313fe1B1e0000000000000000000000000000000000000000000000009b32daf263dd9000",
                network_id: "1",
                save: true,
                to: "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72",
                transaction_index: null,
                value: "0",
                root: res.simulation.id,
              }),
            }
          );
        })
        .then((res) => res.json())
        .then((res) =>
          fetch(
            process.env.CYPRESS_TENDERLY_PROJECT + "/" + forkId + "/simulate",
            {
              method: "POST",
              headers: {
                "x-access-key": process.env.CYPRESS_TENDERLY_KEY,
              },
              body: JSON.stringify({
                access_list: [],
                alias: "",
                block_number: null,
                description: "",
                from: "0x2ef2c9f9DaA42f56B393e36F8376C93313fe1B1e",
                gas: 8000000,
                gas_price: "0",
                generate_access_list: true,
                input:
                  "0x23b872dd0000000000000000000000002ef2c9f9DaA42f56B393e36F8376C93313fe1B1e00000000000000000000000032518828a071a0e6e549f989d4aab4cd7401be8f0000000000000000000000000000000000000000000000009b32daf263dd9000",
                network_id: "1",
                save: true,
                to: "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72",
                transaction_index: null,
                value: "0",
                root: res.simulation.id,
              }),
            }
          )
        )
        .then((res) => res.json())
        .then((res) =>
          fetch(
            process.env.CYPRESS_TENDERLY_PROJECT + "/" + forkId + "/simulate",
            {
              method: "POST",
              headers: {
                "x-access-key": process.env.CYPRESS_TENDERLY_KEY,
              },
              body: JSON.stringify({
                access_list: [],
                alias: "",
                block_number: null,
                description: "",
                from: "0x32518828A071a0e6E549F989D4aaB4Cd7401be8f",
                gas: 8000000,
                gas_price: "0",
                generate_access_list: true,
                input:
                  "0x5c19a95c0000000000000000000000002ef2c9f9DaA42f56B393e36F8376C93313fe1B1e",
                network_id: "1",
                save: true,
                to: "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72",
                transaction_index: null,
                value: "0",
                root: res.simulation.id,
              }),
            }
          )
        );

      return {
        forkId,
        wallet: wallet.privateKey,
        db,
      };
    },
  });
};
