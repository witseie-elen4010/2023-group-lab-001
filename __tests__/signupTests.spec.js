
// Import fucntion and promise pool
const pool = require('../db_connection');
const bcrypt = require('bcrypt');
const { addUser, isEmailValid } = require('../s_signup');

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn()
}));
jest.mock('../db_connection', () => ({
    promise: jest.fn().mockReturnThis(),
    query: jest.fn().mockResolvedValue([{ insertId: 1, affectedRows: 1 }]),
}));

describe('Signup functionality', () => {
    beforeEach(() => {
        // Reset the mock functions
        bcrypt.compare.mockReset();
        pool.query.mockReset();
    });


    test('adds new student correctly to the database', async () => {
        const mockUser = {
            name: 'Jack Test',
            email: 'jack@students.wits.ac.za',
            password: 'password123',
            role: 'student',
        };

        const mockHashedPassword = 'hashed_password123';
        bcrypt.hash.mockResolvedValueOnce(mockHashedPassword);

        // Mock the return value of the pool's query function
        pool.query.mockResolvedValueOnce([[{ insertId: 1, affectedRows: 1 }]])
            .mockResolvedValueOnce([[{ id: 1 }]]);




        const res = await addUser(mockUser.name, mockUser.email, mockUser.password, mockUser.role);

        // Assertions
        expect(res.status).toBe('Valid');
        expect(res.href).toBe('./student_portal_page');

        // Check if the query is called with the correct SQL and parameters
        // The password sent to the query should now be the hashed password
        expect(pool.query).toBeCalledWith(
            "INSERT INTO person (Name, Email, Password, Role) VALUES (?, ?, ?, ?)",
            [mockUser.name, mockUser.email, mockHashedPassword, mockUser.role],
        );
    });


    test('adds new teacher correctly to the database', async () => {
        const mockUser = {
            name: 'Jack Teach',
            email: 'jack@wits.ac.za',
            password: 'password123',
            role: 'teacher',
        };

        const mockHashedPassword = 'hashed_password123';
        bcrypt.hash.mockResolvedValueOnce(mockHashedPassword);

        // Mock the return value of the pool's query function
        pool.query.mockResolvedValueOnce([[{ insertId: 1, affectedRows: 1 }]])
            .mockResolvedValueOnce([[{ id: 1 }]]);




        const res = await addUser(mockUser.name, mockUser.email, mockUser.password, mockUser.role);

        // Assertions
        expect(res.status).toBe('Valid');
        expect(res.href).toBe('./lecturer_dashboard');

        // Check if the query is called with the correct SQL and parameters
        expect(pool.query).toBeCalledWith(
            "INSERT INTO person (Name, Email, Password, Role) VALUES (?, ?, ?, ?)",
            [mockUser.name, mockUser.email, mockHashedPassword, mockUser.role],
        );
    });

    test('returns invalid status when email is already taken', async () => {
        const mockUser = {
            name: 'Jack Test1',
            email: 'jack@students.wits.ac.za',
            password: 'password123',
            role: 'student',
        };

        // Mock the return value of the pool's query function
        pool.query.mockRejectedValueOnce({
            code: 'ER_DUP_ENTRY',
        });

        const res = await addUser(mockUser.name, mockUser.email, mockUser.password, mockUser.role);

        // Assertions
        expect(res.status).toBe('Invalid');
        expect(res.message).toBe('Email already taken');
    });

    afterEach(() => {
        // Clear all instances and calls to constructor and all methods:
        pool.query.mockClear();
    });

});


describe('Email validation', () => {
    it('should return false for student email not ending with @students.wits.ac.za', () => {
        expect(isEmailValid('test@test.com', 'student')).toBe(false);
    });

    it('should return true for student email ending with @students.wits.ac.za', () => {
        expect(isEmailValid('test@students.wits.ac.za', 'student')).toBe(true);
    });

    it('should return false for teacher email not ending with @wits.ac.za', () => {
        expect(isEmailValid('test@test.com', 'teacher')).toBe(false);
    });

    it('should return true for teacher email ending with @wits.ac.za', () => {
        expect(isEmailValid('test@wits.ac.za', 'teacher')).toBe(true);
    });
});

describe('Signup functionality with hashed password', () => {
    afterEach(() => {
        // Clear all instances and calls to constructor and all methods:
        bcrypt.hash.mockClear();
    });

    test('adds new user correctly to the database with hashed password', async () => {
        const mockUser = {
            name: 'Jack Test',
            email: 'jack@students.wits.ac.za',
            password: 'password123',
            role: 'student',
        };

        const mockHashedPassword = 'hashed_password123';

        // Mock the return value of the bcrypt's hash function
        bcrypt.hash.mockResolvedValueOnce(mockHashedPassword);

        // Add the user (this should call bcrypt.hash)
        await addUser(mockUser.name, mockUser.email, mockUser.password, mockUser.role);

        // Assertions
        expect(bcrypt.hash).toBeCalledWith(mockUser.password, 10);
    });
});

const { chromium } = require('playwright');
const randomstring = require('randomstring');

jest.setTimeout(30000);
describe('Signup functionality', () => {
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

    test('Test sign up', async () => {
        await page.goto('https://consultamain.azurewebsites.net/');
        await page.click('#teacher');
        await page.type('#signup-firstname', 'Jack');
        await page.type('#signup-lastname', 'Teacher');
        const email = randomstring.generate() + "@wits.ac.za"; // Generate a unique email
        await page.type('#signup-email', email);
        await page.type('#signup-password', 'password');
        // Click the button and then wait for the URL to change
        await Promise.all([
            page.click('#signup-btn'),
            page.waitForFunction('window.location.href.includes("/lecturer_dashboard")')
        ]);
        // Check that user is redirected to the correct page
        expect(await page.url()).toBe('https://consultamain.azurewebsites.net/lecturer_dashboard');
    });

});


