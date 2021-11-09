describe("Token claim site", () => {
    // let forkId
    before(() => {
        cy.request({
            method: 'POST',
            url: 'https://api.tenderly.co/api/v1/account/Leeondamiky/project/test/fork',
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
            cy.request({
                method: 'POST',
                url: `https://api.tenderly.co/api/v1/account/Leeondamiky/project/test/fork/${result.body.simulation_fork.id}/simulate`,
                headers: {
                    "x-access-key": Cypress.env('TENDERLY_KEY')
                },
                body: {
                    from: "0x0904Dac3347eA47d208F3Fd67402D039a3b99859",
                    to: "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72",
                    input: "0x7cb64759aca22207fc31a4c3ecd6ab11ce2df3db64b8afeba4f31db2b9aeb76f1dada659",
                    gas: 8522744,
                    gas_price: "0",
                    value: 0,
                    save: true,
                }
            }).then(result => {
                console.log('result2: ', result)
            })
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
        cy.contains("Start").click();
        cy.contains("Approve").click();
        cy.contains("Reject").click();

        //should retain intermediate state
        cy.reload();

        cy.contains("Approve").click();
        cy.contains("Reject").click();

        //Should retain vote state after refreshing
        cy.reload()

        cy.contains("Sign").click();
        cy.signMetamaskMessage();

        cy.get('[data-testid="delegate-box-name"]', {timeout: 25000})
            .first()
            .invoke('text').then(name => {

            cy.get('[data-testid="delegate-box-name"]', {timeout: 25000}).first().click()

            // Should retain delegate choice after refresh
            cy.reload()
            cy.contains(name, {timeout: 25000})
                .parent()
                .parent()
                .parent()
                .should('have.css', 'border', '1px solid rgb(73, 179, 147)')

            // Should prepopulate with selection from query string
            cy.visit("http://localhost:3000/delegates?delegate=leontalbert.eth");
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
                cy.contains(
                    "You were eligible for the airdrop!",
                    {timeout: 20000}
                ).should('have.text', 'You were eligible for the airdrop!')

            })
        })
    });
});
