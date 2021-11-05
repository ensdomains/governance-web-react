describe("Token claim site", () => {
    // let forkId
    before(() => {
        cy.request({
            method: 'POST',
            url: 'https://api.tenderly.co/api/v1/account/Leeondamiky/project/test/fork',
            headers: {
                "x-access-key": "uI0ZaReIhdtOUMd3GTtBmDjcSLk4ZRCy"
            },
            body: {"network_id":"1","alias":"","description":""}
        }).then(result => {
            console.log('result: ', result)
            process.env.RPC_URL = `https://rpc.tenderly.co/fork/${result.body.simulation_fork.id}`
            cy.setupMetamask();
            cy.addMetamaskNetwork(
                `tenderly2`,
                `https://rpc.tenderly.co/fork/${result.body.simulation_fork.id}`
            )
        })
    });
    it("Should allow the user to vote, delegate and claim", () => {
        cy.visit("http://localhost:3000");
        cy.contains("MetaMask").click();
        // cy.acceptMetamaskAccess();
        cy.contains("Get Started").click();
        cy.contains("Start your claim process").click();
        cy.contains("Next").click();
        cy.contains("Next").click();
        cy.contains("Start").click();
        cy.contains("Approve").click();
        cy.contains("Reject").click();
        cy.contains("Approve").click();
        cy.contains("Reject").click();
        cy.contains("Sign").click();
        cy.signMetamaskMessage();
        cy.get(
            '[data-testid="delegates-list-container"]',
            {timeout: 20000}
        ).children().first().click()
    });
    //it.todo('should maintain constitution voting state after refresh')
    // it.todo('should maintain delegate selection after refresh')
});
