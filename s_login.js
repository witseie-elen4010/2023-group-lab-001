const conn = require('./db_connection');

async function checkCredentials(username,password){   
   const results = await conn.promise().query(`SELECT * FROM person WHERE Username = '${username}' AND Password = '${password}'`)
   
   if(results[0].length === 1)
   {
      //Just for testing purposes
      console.log(`RESULTS: ${JSON.stringify(results[0])}`)

      if(results[0][0].Role === 'student')
      {

         return {href: './student_portal_page', status: 'Valid'};
         
      }
      else
      {
         return {href: './dashboard', status: 'Valid'};
      }

      
      
   }
   else
   {
      return{href: './signup_login', status: 'Invalid'};
   }

}

module.exports = {checkCredentials};