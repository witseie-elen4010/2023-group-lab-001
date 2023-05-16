const pool = require('./db_connection');

async function checkCredentials(email, password) {
   //Use prepared statements to sanitize inputs to protect from SQL injection attacks
   const [results] = await pool.promise().query("SELECT * FROM person WHERE Email = ? AND Password = ?", [email, password]);
   
   // Check if any results were returned
   if (results.length > 0) {
      // Get the first result
      const user = results[0];
      
      let redirectUrl;
      if (user.Role === 'student') {
         redirectUrl = './student_portal_page';
         return { href: redirectUrl, status: 'Valid' };
      } else if (user.Role === 'teacher') {
         redirectUrl = './lecturer_dashboard';
         return { href: redirectUrl, status: 'Valid' };
      }
   }

   // If no results were returned or if the role did not match either 'student' or 'teacher'
   return { status: 'Invalid', message: 'Invalid Login' };
}



module.exports = { checkCredentials };