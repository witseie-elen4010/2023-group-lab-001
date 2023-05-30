const conn = require('./db_connection');
const bcrypt = require('bcrypt');

function isEmailValid(email, role) {
    if (role === 'student' && !email.endsWith("@students.wits.ac.za")) {
        return false;
    } else if (role === 'teacher' && !email.endsWith("@wits.ac.za")) {
        return false;
    }
    return true;
}


async function addUser(name, email, password, role) {

    // Check if email is valid
    if (!isEmailValid(email, role)) {
        if (role === 'student') {
            return { status: 'Invalid', message: 'Please enter a valid student email' };
        }
        else { return { status: 'Invalid', message: 'Please enter a valid teacher email' }; }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // SQL query to insert new user into the database
    const params = [name, email, hashedPassword, role];

    try {
        //Use prepared statements to sanitize inputs to protect from SQL injection attacks
        const [results] = await conn.promise().query("INSERT INTO person (Name, Email, Password, Role) VALUES (?, ?, ?, ?)", params);
        // Retrieve the ID of the last inserted record
        const [[lastId]] = await conn.promise().query("SELECT LAST_INSERT_ID() AS id");
        const userID = lastId.id;

        let redirectUrl;
        if (role === 'student') {
            redirectUrl = './student_portal_page';
        } else if (role === 'teacher') {
            redirectUrl = './lecturer_dashboard';
        }
        return { href: redirectUrl, status: 'Valid', userID: userID };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return { status: 'Invalid', message: 'Email already taken' };
        }
        // handle other errors as needed
        console.error(error);
        return { status: 'Invalid', message: 'Invalid Signup' };
    }

}


module.exports = { addUser, isEmailValid };
