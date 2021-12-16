let contract;

before(() => {
  cy.viewport(1000, 2000);
  cy.task("createMerkleFork").then((res) => (contract = res));
});

describe("Token claim site", () => {
  before(() => {
    cy.task("setMetamaskData", {
      secretWords:
        "test test test test test test test test test test test junk",
      network: "tenderly",
      password: "MetaMaskTest",
    }).then(() => {
      cy.setupMetamask("");
    });
  });
  it("Should allow user to claim EP2", () => {
    cy.visit("http://localhost:3000").then(
      () => (process.env.MERKLE_AIRDROP = contract)
    );
    cy.get('[data-testid="header-connect-button"').click();
    cy.contains("MetaMask").click();
    cy.acceptMetamaskAccess();
    cy.contains("Get started").click();
    cy.wait(100000);
  });
});
