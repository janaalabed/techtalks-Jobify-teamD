// connection.example.js
// -----------------------------------------------------------
// This is the example database connection file for Jobify.
// Developers(each team member) should copy this file and rename it to:
//     connection.js
//
// Then you must fill in your OWN local MySQL credentials.
// -----------------------------------------------------------

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',             // Your local MySQL host
    user: 'your_mysql_user',       // Your MySQL username
    password: 'your_mysql_password', // Your MySQL password
    database: 'jobify',            // Local database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
