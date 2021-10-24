describe('My First Test', () => {
    before(() => {
        cy.setupMetamask();
        cy.changeMetamaskNetwork('tenderly')
        // cy.visit('/')
    });
    it('Does not do much!', () => {
        cy.visit('http://localhost:3000')
    })
})
