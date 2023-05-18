const conn = require('./db_connection');

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

    // Hash password at later stage
    //const hashedPassword = await bcrypt.hash(password, 10);

    // SQL query to insert new user into the database
    const params = [name, email, password, role];
    try {
        //Use prepared statements to sanitize inputs to protect from SQL injection attacks
        const [results] = await conn.promise().query("INSERT INTO person (Name, Email, Password, Role) VALUES (?, ?, ?, ?)", params);
        let redirectUrl;
        if (role === 'student') {
            redirectUrl = './student_portal_page';
        } else if (role === 'teacher') {
            redirectUrl = './lecturer_dashboard';
        }
        return { href: redirectUrl, status: 'Valid' };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return { status: 'Invalid', message: 'Email already taken' };
        }
        // handle other errors as needed
    }
}


module.exports = { addUser, isEmailValid };
