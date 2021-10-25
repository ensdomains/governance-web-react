describe('Token claim site', () => {
    before(() => {
        cy.setupMetamask();
        cy.changeMetamaskNetwork('tenderly')
        // cy.visit('/')
    });
    it('Should allow the user to vote, delegate and claim', () => {
        cy.visit('http://localhost:3000')
        cy.contains('MetaMask').click()
        cy.acceptMetamaskAccess()
        // cy.contains('Next').click()
    })
})
