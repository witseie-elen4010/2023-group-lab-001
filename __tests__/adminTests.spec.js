const { chromium } = require('playwright');
jest.setTimeout(30000);
describe('Admin Page functionality', () => {
    let browser, page;

    beforeAll(async () => {
        browser = await chromium.launch();
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        page = await browser.newPage();
    });

    afterEach(async () => {
        await page.close();
    });

    test('Admin login + logout test', async () => {
        await page.goto('https://consultamain.azurewebsites.net/');
        await page.type('#login-email', 'admin@wits.ac.za');
        await page.type('#login-password', 'admin');
        // Click the button and then wait for the URL to change
        await Promise.all([
            page.click('#login-btn'),
            page.waitForFunction('window.location.href.includes("/admin")')
        ]);

        // Check that user is redirected to correct page
        expect(await page.url()).toBe('https://consultamain.azurewebsites.net/admin');

        // Click the logout button
        await Promise.all([
            page.click('button.btn-secondary'),
            page.waitForNavigation()
        ]);

        // Check that user is redirected to the login page
        expect(await page.url()).toBe('https://consultamain.azurewebsites.net/');
    });


})