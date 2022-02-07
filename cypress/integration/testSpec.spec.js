before(() => {
  if (Cypress.env("DELEGATE_WALLET")) return;
  cy.viewport(1000, 2000);
  cy.request({
    method: "POST",
    url: Cypress.env("TENDERLY_PROJECT"),
    headers: {
      "x-access-key": Cypress.env("TENDERLY_KEY"),
    },
    body: { network_id: "1", alias: "", description: "" },
  })
    .then((result) =>
      Promise.all([
        cy.task(
          "submitRpcUrl",
          `https://rpc.tenderly.co/fork/${result.body.simulation_fork.id}`
        ),
        cy.task("setupDelegateWallet", result.body.simulation_fork.id),
      ])
    )
    .then((res) => Cypress.env("DELEGATE_WALLET", res))
    .then(() => {
      cy.setupMetamask("");
    });
});

describe("Token claim site", () => {
  beforeEach(() => {
    cy.interceptDelegateBySig();
  });

  it("Should allow the user to vote, delegate and claim", () => {
    cy.visit("http://localhost:3000");
    cy.get('[data-testid="header-connect-button"').click();
    cy.contains("MetaMask").click();
    cy.acceptMetamaskAccess();
    cy.contains("Get started").click();
    cy.contains("Start your claim process", { timeout: 10000 }).click();

    cy.contains("Next").click();
    cy.contains("Next").click();

    cy.get('[data-testid="delegate-box-name"]', { timeout: 25000 })
      .first()
      .invoke("text")
      .then((name) => {
        cy.get('[data-testid="delegate-box-name"]', { timeout: 25000 })
          .first()
          .click();

        // Should retain delegate choice after refresh
        cy.reload();
        cy.contains(name, { timeout: 25000 })
          .parent()
          .parent()
          .parent()
          .should("have.css", "border", "1px solid rgb(73, 179, 147)");

        // Should prepopulate with selection from query string
        cy.visit("http://localhost:3000/delegates?delegate=leontalbert.eth");
        cy.get('[data-testid="delegate-box-name"]', { timeout: 25000 })
          .first()
          .invoke("text")
          .then((prepopName) => {
            expect(prepopName).to.equal("leontalbert.eth");

            // Should be able to enter address manually
            cy.contains("Enter ENS or address").click();
            cy.wait(5000);
            cy.get("input").clear();
            cy.get("input").type("abracadabraalakazam.eth");
            cy.wait(5000);
            cy.contains("Next").click({ force: true });
            cy.get("input").clear();
            cy.get("input").type("0xBe8563B89d31AD287c73da42848Bd7646172E");
            cy.wait(5000);
            cy.contains("Next").click({ force: true });
            cy.get("input").type("0ba");
            cy.wait(5000);
            cy.contains("Next").click();
            cy.contains("leontalbert.eth", { timeout: 20000 });

            cy.contains("Claim", { timeout: 20000 }).click();
            cy.confirmMetamaskTransaction();
            cy.contains("Return to dashboard", { timeout: 20000 }).click();

            //Should change to claimed state after claiming
            cy.contains("You were eligible for the airdrop!", {
              timeout: 20000,
            });
            cy.contains("Tokens claimed successfully").click({ force: true });
            cy.contains("You were eligible for the airdrop!", {
              timeout: 20000,
            }).should("have.text", "You were eligible for the airdrop!");

            // //If already claimed should redirect to dashboard
            cy.visit("http://localhost:3000/delegates");
            cy.contains("You were eligible for the airdrop!", {
              timeout: 20000,
            }).should("have.text", "You were eligible for the airdrop!");
          });
      });
  });

  it("Should allow the user navigate to delegate and delegate tokens gas-free", () => {
    cy.visit("http://localhost:3000");
    cy.get('[data-testid="header-connect-button"').click();
    cy.contains("MetaMask").click();
    cy.contains("Delegates").click();

    cy.contains("You have delegated 47.24 votes to", {
      timeout: 20000,
      exact: false,
    }).should("have.text", "You have delegated 47.24 votes to", {
      exact: false,
    });

    cy.get('[data-testid="delegate-box-name"]', { timeout: 25000 })
      .first()
      .invoke("text")
      .then((name) => {
        cy.get('[data-testid="delegate-box-name"]', { timeout: 25000 })
          .first()
          .click();
        cy.wait(5000);
        cy.contains("Gas Free", { timeout: 20000 }).should(
          "have.text",
          "Gas Free"
        );
        cy.get('[data-testid="right-cta"]')
          .should("have.text", "Delegate")
          .click({ timeout: 10000 });
        cy.signMetamaskTypedData();

        cy.get('[data-testid="current-delegation"]', {
          timeout: 25000,
        })
          .contains(name, { exact: false, timeout: 25000 })
          .should("have.text", name, {
            exact: false,
          });
      });

    cy.contains("Requires Gas", { timeout: 20000 }).should(
      "have.text",
      "Requires Gas"
    );
  });

  it("Should allow manual delegation with gas", () => {
    cy.visit("http://localhost:3000");
    cy.get('[data-testid="header-connect-button"').click();
    cy.contains("MetaMask").click();
    cy.contains("Delegates").click();

    cy.contains("You have delegated 47.24 votes to", {
      timeout: 20000,
      exact: false,
    }).should("have.text", "You have delegated 47.24 votes to", {
      exact: false,
    });

    cy.contains("Enter ENS or address").click();
    cy.wait(5000);
    cy.contains("Requires Gas", { timeout: 20000 }).should(
      "have.text",
      "Requires Gas"
    );
    cy.get("input").clear();
    cy.get("input").type("nick.eth");
    cy.wait(5000);
    cy.get('[data-testid="right-cta"]', { timeout: 25000 })
      .should("have.text", "Delegate")
      .click({ timeout: 10000 });
    cy.confirmMetamaskTransaction();

    cy.get('[data-testid="current-delegation"]', {
      timeout: 25000,
    })
      .contains("nick.eth", { exact: false, timeout: 25000 })
      .should("have.text", "nick.eth", {
        exact: false,
      });
  });

  it("Should allow disconnection and reconnection", () => {
    cy.visit("http://localhost:3000");
    // User connects
    cy.get('[data-testid="header-connect-button"').click();
    cy.contains("MetaMask").click();
    cy.wait(1000);
    // User disconnects
    cy.get('[data-testid="profile-dropdown"]').click();
    cy.contains("Disconnect").click();
    // User reconnects
    cy.get('[data-testid="header-connect-button"').click();
    cy.contains("MetaMask").click();
    // Check user is connected
    cy.get('[data-testid="profile-dropdown"]');
  });
});
