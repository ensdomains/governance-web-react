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
            )}00000000000000000000000000000000000000000000152d02c7e14af6800000`,
            network_id: "1",
            save: true,
            to: "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72",
            transaction_index: null,
            value: "0",
          }),
        }
      );

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
            from: "0xbe8563b89d31ad287c73da42848bd7646172e0ba",
            gas: 8000000,
            gas_price: "0",
            generate_access_list: true,
            input: '0x095ea7b3000000000000000000000000be8563b89d31ad287c73da42848bd7646172e0ba00000000000000000000000000000000000000000000000009b32daf263dd900',
            network_id: "1",
            save: true,
            to: "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72",
            transaction_index: null,
            value: "0",
          }),
        }
      );

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
            from: "0xbe8563b89d31ad287c73da42848bd7646172e0ba",
            gas: 8000000,
            gas_price: "0",
            generate_access_list: true,
            input: '0x23b872dd000000000000000000000000be8563b89d31ad287c73da42848bd7646172e0ba00000000000000000000000032518828a071a0e6e549f989d4aab4cd7401be8f00000000000000000000000000000000000000000000000009b32daf263dd900',
            network_id: "1",
            save: true,
            to: "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72",
            transaction_index: null,
            value: "0",
          }),
        }
      );

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
            from: "0x32518828A071a0e6E549F989D4aaB4Cd7401be8f",
            gas: 8000000,
            gas_price: "0",
            generate_access_list: true,
            input: '0x5c19a95c000000000000000000000000be8563b89d31ad287c73da42848bd7646172e0ba',
            network_id: "1",
            save: true,
            to: "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72",
            transaction_index: null,
            value: "0",
          }),
        }
      );

      return {
        forkId,
        wallet: wallet.privateKey,
        db,
      };
    },
  });
};
