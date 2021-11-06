describe("Token claim site", () => {
    // let forkId
    before(() => {
        cy.request({
            method: 'POST',
            url: 'https://api.tenderly.co/api/v1/account/Leeondamiky/project/test/fork',
            headers: {
                "x-access-key": "uI0ZaReIhdtOUMd3GTtBmDjcSLk4ZRCy"
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
                    "x-access-key": "uI0ZaReIhdtOUMd3GTtBmDjcSLk4ZRCy"
                },
                body: {
                    from: "0x0904Dac3347eA47d208F3Fd67402D039a3b99859",
                    to: "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72",
                    input: "0x7cb647592c05204eb0b864c264d9bfd6957940471791ad2e156f2ede49db351d3ace3dea",
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
    it("Should allow the user to vote, delegate and claim", async () => {

        cy.visit("http://localhost:3000");
        cy.contains("MetaMask").click();
        // cy.acceptMetamaskAccess();
        cy.contains("Get started").click();
        cy.contains("Start your claim process").click();
        cy.contains("Next").click();
        cy.contains("Next").click();
        cy.contains("Start").click();
        cy.contains("Approve").click();
        cy.contains("Reject").click();
        cy.contains("Approve").click();
        cy.contains("Reject").click();

        //Should retain vote state after refreshing
        cy.reload()

        cy.contains("Sign").click();
        cy.signMetamaskMessage();

        let name = await cy.get('[data-testid="delegate-box-name', {timeout: 25000})
            .first()
            .invoke('text').promisify()

        cy.get('[data-testid="delegate-box-name', {timeout: 25000}).first().click()

        // Should retain delegate choice after refresh
        cy.reload()
        cy.contains(name, { timeout: 10000 })
            .parent()
            .parent()
            .parent()
            .should('have.css', 'border', '1px solid rgb(73, 179, 147)')

        // //should prepopulate with selection from query string
        // cy.visit("http://localhost:3000/delegates?delegate=leontalbert.eth");
        // const prepopName = cy.get('[data-testid="delegate-box-name"]', {timeout: 25000})
        //     .children({timeout: 25000})
        //     .first()
        //
        // console.log('prepopName ', prepopName)
        // // expect(prepopName).to.equal('leontalbert.eth')
        //
        // cy.contains("Next").click();
        //
        // cy.contains("Claim").click();
        // cy.confirmMetamaskTransaction();
        // cy.contains("Return to dashboard").click();
        //
        // //Should change to claimed state after claiming
        // cy.contains("You were eligible for the airdrop!")
        // cy.contains("Tokens claimed successfully").click()
        // cy.contains("You were eligible for the airdrop!").should('have.text', 'You were eligible for the airdrop!')
        //
        // //If already claimed should redirect to dashboard
        // cy.visit("http://localhost:3000/delegates");
        // cy.contains(
        //     "You were eligible for the airdrop!",
        //     {timeout: 20000}
        // ).should('have.text', 'You were eligible for the airdrop!')
    });
});
