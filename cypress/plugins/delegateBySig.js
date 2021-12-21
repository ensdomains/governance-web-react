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

      return {
        forkId,
        wallet: wallet.privateKey,
        db,
      };
    },
  });
};
