const login = require('../s_login');
const bcrypt = require('bcrypt');
const db = require('../db_connection');

// Mock bcrypt.compare()
bcrypt.compare = jest.fn();

// Mock pool.promise().query()
const pool = db.promise();
pool.query = jest.fn();

describe("Test login functionality", () => {

   beforeEach(() => {
      // Reset the mock functions
      bcrypt.compare.mockReset();
      pool.query.mockReset();
   });

   test("Test that checkCredentials function can query database", async () => {
      const mockUser = {
         email: 'teststudent@students.wits.ac.za',
         password: 'password',
      };

      const mockHashedPassword = 'hashed_password';

      // Mock the return values of the external dependencies
      bcrypt.compare.mockImplementationOnce(() => Promise.resolve(true));
      pool.query.mockImplementationOnce(() => Promise.resolve([
         {
            Email: mockUser.email,
            Password: mockHashedPassword,
            Role: 'student',
         }
      ]));

      const result = await login.checkCredentials(mockUser.email, mockUser.password);

      // Validate the result
      expect(result.status).toBe('Valid');
      expect(result.href).toBe('./student_portal_page');
   });

   test("Test that an incorrect email is invalidated", async () => {
      const mockUser = {
         email: 'wrongUser01@email.com',
         password: 'password',
      };

      // Mock the return values of the external dependencies
      bcrypt.compare.mockImplementationOnce(() => Promise.resolve(true));
      pool.query.mockImplementationOnce(() => Promise.resolve([]));

      const result = await login.checkCredentials(mockUser.email, mockUser.password);

      // Validate the result
      expect(result.status).toBe('Invalid');
   });

   test("Test that an incorrect password is invalidated", async () => {
      const mockUser = {
         email: 'teststudent@students.wits.ac.za',
         password: 'wrongPassword',
      };

      const mockHashedPassword = 'hashed_wrong_password';

      // Mock the return values of the external dependencies
      bcrypt.compare.mockImplementationOnce(() => Promise.resolve(false));
      pool.query.mockImplementationOnce(() => Promise.resolve([
         {
            Email: mockUser.email,
            Password: mockHashedPassword,
            Role: 'student',
         }
      ]));

      const result = await login.checkCredentials(mockUser.email, mockUser.password);

      // Validate the result
      expect(result.status).toBe('Invalid');
   });

   test("Test that lecturer is redirected to correct page", async () => {
      const mockUser = {
         email: 'johntest@wits.ac.za',
         password: 'teacher',
      };

      const mockHashedPassword = 'hashed_password';

      // Mock the return values of the external dependencies
      bcrypt.compare.mockImplementationOnce(() => Promise.resolve(true));
      pool.query.mockImplementationOnce(() => Promise.resolve([
         {
            Email: mockUser.email,
            Password: mockHashedPassword,
            Role: 'teacher',
         }
      ]));

      const result = await login.checkCredentials(mockUser.email, mockUser.password);

      // Validate the result
      expect(result.status).toBe('Valid');
      expect(result.href).toBe('./lecturer_dashboard');
   });

   test("Test that student is redirected to correct page", async () => {
      const mockUser = {
         email: 'teststudent@students.wits.ac.za',
         password: 'password',
      };

      const mockHashedPassword = 'hashed_password';

      // Mock the return values of the external dependencies
      bcrypt.compare.mockImplementationOnce(() => Promise.resolve(true));
      pool.query.mockImplementationOnce(() => Promise.resolve([
         {
            Email: mockUser.email,
            Password: mockHashedPassword,
            Role: 'student',
         }
      ]));

      const result = await login.checkCredentials(mockUser.email, mockUser.password);

      // Validate the result
      expect(result.status).toBe('Valid');
      expect(result.href).toBe('./student_portal_page');
   });

   afterAll(() => {
      pool.end(); //Clear all open connections
   });

});

const { chromium } = require('playwright');
jest.setTimeout(30000);
describe('Login functionality', () => {
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

   test('Lecturer test login', async () => {
      await page.goto('https://consultamain.azurewebsites.net/');
      await page.type('#login-email', 'steve@wits.ac.za');
      await page.type('#login-password', 'software');
      // Click the button and then wait for the URL to change
      await Promise.all([
         page.click('#login-btn'),
         page.waitForFunction('window.location.href.includes("/lecturer_dashboard")')
      ]);

      // Check that user is redirected to correct page
      expect(await page.url()).toBe('https://consultamain.azurewebsites.net/lecturer_dashboard');
   });

   test('Student test login', async () => {
      await page.goto('https://consultamain.azurewebsites.net/');
      await page.type('#login-email', 'liad@students.wits.ac.za');
      await page.type('#login-password', 'software');
      // Click the button and then wait for the URL to change
      await Promise.all([
         page.click('#login-btn'),
         page.waitForFunction('window.location.href.includes("/student_portal_page")')
      ]);

      // Check that user is redirected to correct page
      expect(await page.url()).toBe('https://consultamain.azurewebsites.net/student_portal_page');
   });


   test('Admin test login', async () => {
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
   });
})