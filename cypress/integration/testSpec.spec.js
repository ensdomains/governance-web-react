describe('Token claim site', () => {
    before(() => {
        cy.setupMetamask();
        cy.changeMetamaskNetwork('tenderly')
    });
    it('Should allow the user to vote, delegate and claim', () => {
        cy.visit('http://localhost:3000')
        cy.contains('MetaMask').click()
        cy.acceptMetamaskAccess()
        cy.contains('Get Started').click()
        cy.contains('Start claim process').click()
        cy.contains('Next').click()
        cy.contains('Next').click()
        cy.contains('leontalbert.eth').click()
        cy.contains('Next').click()
        cy.contains('Next').click()
        cy.contains('Approve').click()
        cy.contains('Approve').click()
        cy.contains('Approve').click()
        cy.contains('Approve').click()
        cy.contains('Sign').click()
        cy.signMetamaskMessage()
    })
    //it.todo('should maintain constitution voting state after refresh')
    // it.todo('should maintain delegate selection after refresh')
})
