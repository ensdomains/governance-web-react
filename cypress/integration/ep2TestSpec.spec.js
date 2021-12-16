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
  it("Should allow user to claim EP2 tokens", () => {
    cy.visit("http://localhost:3000").then(
      () => (process.env.MERKLE_AIRDROP = contract)
    );
    cy.get('[data-testid="header-connect-button"]').click();
    cy.contains("MetaMask").click();
    cy.acceptMetamaskAccess();
    cy.contains("Get started").click();
    cy.get("[data-testid='claim-ep2-button']", { timeout: 20000 }).click();

    cy.contains("Claim").click();
    cy.confirmMetamaskTransaction();
    cy.contains("Return to dashboard", { timeout: 20000 }).click();

    //Should change to claimed state after claiming
    cy.get("[data-testid='claim-ep2-button']", { timeout: 20000 }).should(
      "have.text",
      "Claimed"
    );

    // //If already claimed should redirect to dashboard
    cy.visit("http://localhost:3000/ep2/summary");
    cy.get('[data-testid="header-connect-button"]').click();
    cy.contains("MetaMask").click();
    cy.get("[data-testid='claim-ep2-button']", { timeout: 20000 }).should(
      "have.text",
      "Claimed"
    );
  });
});
