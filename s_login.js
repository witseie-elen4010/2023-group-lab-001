const bcrypt = require('bcrypt');
const pool = require('./db_connection');

async function checkCredentials(email, enteredPassword) {
   // Query only for user data without trying to match password in SQL
   const [results] = await pool.promise().query("SELECT * FROM person WHERE Email = ?", [email]);

   if (results.length > 0) {
      // Get the first result (the user)
      const user = results[0];

      // Check the entered password against the stored hashed password
      const passwordMatch = await bcrypt.compare(enteredPassword, user.Password);

      if (passwordMatch) {
         let redirectUrl;
         if (user.Role === 'student') {
            redirectUrl = './student_portal_page';
         } else if (user.Role === 'teacher') {
            redirectUrl = './lecturer_dashboard';
         }
         return { href: redirectUrl, status: 'Valid' };
      }
   }

   // If no results were returned, or if the password didn't match
   return { status: 'Invalid', message: 'Invalid Login' };
}

module.exports = { checkCredentials };