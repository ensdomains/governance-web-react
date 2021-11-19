describe("Token claim site", () => {
    // let forkId
    before(() => {
        cy.viewport(1000, 2000)
        cy.request({
            method: 'POST',
            url: 'https://api.tenderly.co/api/v1/account/ens/project/core/fork',
            headers: {
                "x-access-key": Cypress.env('TENDERLY_KEY')
            },
            body: {"network_id": "1", "alias": "", "description": ""}
        }).then(result => {
            process.env.RPC_URL = `https://rpc.tenderly.co/fork/${result.body.simulation_fork.id}`
            cy.setupMetamask('');
            cy.addMetamaskNetwork(
                `tenderly2`,
                `https://rpc.tenderly.co/fork/${result.body.simulation_fork.id}`
            )
        })
    });
    it("Should allow the user to vote, delegate and claim", () => {

        cy.visit("http://localhost:3000");
        cy.contains("MetaMask").click();
        cy.acceptMetamaskAccess();
        cy.contains("Get started").click();
        cy.contains("Start your claim process", { timeout: 10000 }).click();

        cy.contains("Next").click();
        cy.contains("Next").click();

        cy.get('[data-testid="delegate-box-name"]', {timeout: 25000})
            .first()
            .invoke('text').then(name => {

            cy.get('[data-testid="delegate-box-name"]', {timeout: 25000}).first().click()

            // Should retain delegate choice after refresh
            cy.reload()
            cy.contains("MetaMask").click();
            cy.contains(name, {timeout: 25000})
                .parent()
                .parent()
                .parent()
                .should('have.css', 'border', '1px solid rgb(73, 179, 147)')

            // Should prepopulate with selection from query string
            cy.visit("http://localhost:3000/delegates?delegate=leontalbert.eth");
            cy.contains("MetaMask").click();
            cy.get('[data-testid="delegate-box-name"]', {timeout: 25000})
                .first().invoke('text').then(prepopName => {

                expect(prepopName).to.equal('leontalbert.eth')

                // Should be able to enter address manually
                cy.contains('Enter ENS or address').click()
                cy.wait(5000)
                cy.get('input').clear()
                cy.get('input').type('abracadabraalakazam.eth')
                cy.contains('Next').click({force: true})
                cy.get('input').clear()
                cy.get('input').type('0xBe8563B89d31AD287c73da42848Bd7646172E')
                cy.wait(5000)
                cy.contains('Next').click({force: true})
                cy.get('input').type('0ba')
                cy.wait(5000)
                cy.contains('Next').click()
                cy.contains('leontalbert.eth', { timeout: 20000 })

                cy.contains("Claim", {timeout: 20000}).click();
                cy.confirmMetamaskTransaction();
                cy.contains("Return to dashboard", {timeout: 20000}).click();

                //Should change to claimed state after claiming
                cy.contains("You were eligible for the airdrop!", {timeout: 20000})
                cy.contains("Tokens claimed successfully").click({force: true})
                cy.contains("You were eligible for the airdrop!", {timeout: 20000}).should('have.text', 'You were eligible for the airdrop!')

                // //If already claimed should redirect to dashboard
                cy.visit("http://localhost:3000/delegates");
                cy.contains("MetaMask").click();
                cy.contains(
                    "You were eligible for the airdrop!",
                    {timeout: 20000}
                ).should('have.text', 'You were eligible for the airdrop!')

            })
        })
    });
});
