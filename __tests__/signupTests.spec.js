
// Import fucntion and promise pool
const { addUser } = require('../s_signup');
const pool = require('../db_connection');

jest.mock('../db_connection', () => ({
    promise: jest.fn().mockReturnThis(),
    query: jest.fn(),
}));

describe('Signup functionality', () => {
    afterEach(() => {
        // Clear all instances and calls to constructor and all methods:
        pool.query.mockClear();
    });

    test('adds new student correctly to the database', async () => {
        const mockUser = {
            name: 'Jack Test',
            email: 'jack@students.wits.ac.za',
            password: 'password123',
            role: 'student',
        };

        // Mock the return value of the pool's query function
        pool.query.mockResolvedValueOnce([{
            ...mockUser,
            Role: mockUser.role,
            Name: mockUser.name,
            Email: mockUser.email,
            Password: mockUser.password,
        }]);

        const res = await addUser(mockUser.name, mockUser.email, mockUser.password, mockUser.role);

        // Assertions
        expect(res.status).toBe('Valid');
        expect(res.href).toBe('./student_portal_page');

        // Check if the query is called with the correct SQL and parameters
        expect(pool.query).toBeCalledWith(
            "INSERT INTO person (Name, Email, Password, Role) VALUES (?, ?, ?, ?)",
            [mockUser.name, mockUser.email, mockUser.password, mockUser.role],
        );
    });

    test('adds new teacher correctly to the database', async () => {
        const mockUser = {
            name: 'Jack Teach',
            email: 'jack@wits.ac.za',
            password: 'password123',
            role: 'teacher',
        };

        // Mock the return value of the pool's query function
        pool.query.mockResolvedValueOnce([{
            ...mockUser,
            Role: mockUser.role,
            Name: mockUser.name,
            Email: mockUser.email,
            Password: mockUser.password,
        }]);

        const res = await addUser(mockUser.name, mockUser.email, mockUser.password, mockUser.role);

        // Assertions
        expect(res.status).toBe('Valid');
        expect(res.href).toBe('./lecturer_dashboard');

        // Check if the query is called with the correct SQL and parameters
        expect(pool.query).toBeCalledWith(
            "INSERT INTO person (Name, Email, Password, Role) VALUES (?, ?, ?, ?)",
            [mockUser.name, mockUser.email, mockUser.password, mockUser.role],
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

});

const { isEmailValid } = require('../s_signup');

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