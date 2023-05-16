/* eslint-env jest */

//const conn = require('../db_connection')

const login = require('../s_login')

//jest.useFakeTimers()


   test('Just a dummy test to check jest is working', () => {
      //doNothing
   });


describe("Test login functionality", () =>{

     test("Test that checkCredentials function can query database", async () => {

        const results = await login.checkCredentials('user01@email.com', 'password');
                
         expect(results.status).toBe('Valid');

    });

    test("Test that an incorrect email is invalidated", async() => {

      const results = await login.checkCredentials('wrongUser01@email.com', 'password');
                
         expect(results.status).toBe('Invalid');
    });

    test("Test that an incorrect password is invalidated", async() => {

      const results = await login.checkCredentials('user01@email.com', 'wrongPassword');
                
         expect(results.status).toBe('Invalid');
    });

    test("Test that student is redirected to correct page", async () =>{   

      const results = await login.checkCredentials('user01@email.com', 'password');
      
      expect(results.href).toBe('./student_portal_page')

    });

    test("Test that lecturer is redirected to correct page", async () =>{   

      const results = await login.checkCredentials('johntest@wits.ac.za', 'teacher');
      
      expect(results.href).toBe('./lecturer_dashboard')

    });

});