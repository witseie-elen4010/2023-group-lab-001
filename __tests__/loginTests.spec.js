const login = require('../s_login')
const bcrypt = require('bcrypt')
const db = require('../db_connection')

// Mock bcrypt.compare()
bcrypt.compare = jest.fn()

// Mock pool.promise().query()
const pool = db.promise()
pool.query = jest.fn()

describe('Test login functionality', () => {
   beforeEach(() => {
      // Reset the mock functions
      bcrypt.compare.mockReset()
      pool.query.mockReset()
   })

   test('Test that checkCredentials function can query database', async () => {
      const mockUser = {
         email: 'teststudent@students.wits.ac.za',
         password: 'password'
      };

      const mockHashedPassword = 'hashed_password'

      // Mock the return values of the external dependencies
      bcrypt.compare.mockImplementationOnce(() => Promise.resolve(true))
      pool.query.mockImplementationOnce(() => Promise.resolve([
         {
            Email: mockUser.email,
            Password: mockHashedPassword,
            Role: 'student'
         }
      ]))

      const result = await login.checkCredentials(mockUser.email, mockUser.password)

      // Validate the result
      expect(result.status).toBe('Valid')
      expect(result.href).toBe('./student_portal_page')
   })

   test('Test that an incorrect email is invalidated', async () => {
      const mockUser = {
         email: 'wrongUser01@email.com',
         password: 'password'
      };

      // Mock the return values of the external dependencies
      bcrypt.compare.mockImplementationOnce(() => Promise.resolve(true))
      pool.query.mockImplementationOnce(() => Promise.resolve([]))

      const result = await login.checkCredentials(mockUser.email, mockUser.password)

      // Validate the result
      expect(result.status).toBe('Invalid')
   })

   test('Test that an incorrect password is invalidated', async () => {
      const mockUser = {
         email: 'teststudent@students.wits.ac.za',
         password: 'wrongPassword'
      };

      const mockHashedPassword = 'hashed_wrong_password'

      // Mock the return values of the external dependencies
      bcrypt.compare.mockImplementationOnce(() => Promise.resolve(false))
      pool.query.mockImplementationOnce(() => Promise.resolve([
         {
            Email: mockUser.email,
            Password: mockHashedPassword,
            Role: 'student'
         }
      ]))

      const result = await login.checkCredentials(mockUser.email, mockUser.password)

      // Validate the result
      expect(result.status).toBe('Invalid')
   })

   test('Test that lecturer is redirected to correct page', async () => {
      const mockUser = {
         email: 'johntest@wits.ac.za',
         password: 'teacher'
      };

      const mockHashedPassword = 'hashed_password'

      // Mock the return values of the external dependencies
      bcrypt.compare.mockImplementationOnce(() => Promise.resolve(true))
      pool.query.mockImplementationOnce(() => Promise.resolve([
         {
            Email: mockUser.email,
            Password: mockHashedPassword,
            Role: 'teacher'
         }
      ]))

      const result = await login.checkCredentials(mockUser.email, mockUser.password)

      // Validate the result
      expect(result.status).toBe('Valid')
      expect(result.href).toBe('./lecturer_dashboard')
   })

   test('Test that student is redirected to correct page', async () => {
      const mockUser = {
         email: 'teststudent@students.wits.ac.za',
         password: 'password'
      };

      const mockHashedPassword = 'hashed_password'

      // Mock the return values of the external dependencies
      bcrypt.compare.mockImplementationOnce(() => Promise.resolve(true))
      pool.query.mockImplementationOnce(() => Promise.resolve([
         {
            Email: mockUser.email,
            Password: mockHashedPassword,
            Role: 'student'
         }
      ]))

      const result = await login.checkCredentials(mockUser.email, mockUser.password)

      // Validate the result
      expect(result.status).toBe('Valid')
      expect(result.href).toBe('./student_portal_page')
   })

   afterAll(() => {
      pool.end() //Clear all open connections
   })

})
