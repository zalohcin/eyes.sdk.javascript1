describe.only('JS layout', () => {
    it('should support js layouts in cypress', () => {
        cy.visit('https://applitools.github.io/demo/TestPages/JsLayout/');
        cy.eyesOpen({
            appName: 'JS layout',
            testName: 'testing js layout support in cypress',
            browser: [
                { width: 800, height: 600, name: 'chrome' },
                { deviceName: 'iPhone 11', screenOrientation: 'portrait' },
                { deviceName: 'Pixel 2', screenOrientation: 'portrait' }
            ],
            layoutBreakpoints: [500, 800]
        });
        cy.eyesCheckWindow('Test');
        cy.eyesClose();
    });
});