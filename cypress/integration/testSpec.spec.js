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

  it("Should allow the user navigate to delegate and delegate tokens gas-free", () => {
    cy.visit("http://localhost:3000");
    cy.get('[data-testid="header-connect-button"').click();
    cy.get("w3m-modal")
      .shadow()
      .find("wui-flex")
      .find("wui-card")
      .find("w3m-router")
      .shadow()
      .find("div")
      .find("w3m-connect-view")
      .shadow()
      .find("wui-flex")
      .find('[name="Browser Wallet"]')
      .click();
    cy.wait(30000);
    cy.contains("Delegates").click();

    cy.contains("You have delegated 1.00 votes to", {
      timeout: 20000,
      exact: false,
    }).should("have.text", "You have delegated 1.00 votes to", {
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

        cy.get("[data-testid='etherscan-box']", { timeout: 10000 }).should(
          "have.text",
          "Your transaction is queuedView on Etherscan"
        );

        cy.get('[data-testid="right-cta"]')
          .should("have.text", "Return to delegates")
          .click();

        cy.reload();
        cy.wait(20000);

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

    cy.get("w3m-modal")
      .shadow()
      .find("wui-flex")
      .find("wui-card")
      .find("w3m-router")
      .shadow()
      .find("div")
      .find("w3m-connect-view")
      .shadow()
      .find("wui-flex")
      .find('[name="Browser Wallet"]')
      .click();

    cy.contains("Delegates").click();

    cy.contains("You have 1.00 undelegated votes", {
      timeout: 20000,
      exact: false,
    }).should("have.text", "You have 1.00 undelegated votes", {
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
