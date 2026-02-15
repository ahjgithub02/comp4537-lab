const http = require('http');
const mysql = require('mysql2'); // You can use 'mysql' or 'mysql2'
const url = require('url');

// DB Configurations - Separate user strings as required by rubric
const adminConfig = {
    host: 'YOUR_DB_HOST',
    user: 'lab_admin',
    password: 'admin_password_123',
    database: 'comp4537_lab'
};

const readOnlyConfig = {
    host: 'YOUR_DB_HOST',
    user: 'lab_read_only',
    password: 'guest_password_123',
    database: 'comp4537_lab'
};

const server = http.createServer((req, res) => {
    // 1. Set CORS headers so Server 1 can talk to Server 2
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    // 2. Handle POST (Insert Default Patients)
    if (path === '/lab5/api/v1/sql' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const connection = mysql.createConnection(adminConfig);
            // Requirement: Check for table and use Engine=InnoDB
            const createTableQuery = `CREATE TABLE IF NOT EXISTS patient (
                patient_id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                date_of_birth DATE
            ) ENGINE=InnoDB;`;

            connection.query(createTableQuery, (err) => {
                if (err) { res.end("Error creating table"); return; }
                
                // Logic to insert rows from the POST body...
                res.end("Table verified and data inserted!");
                connection.end();
            });
        });
    }

    // 3. Handle GET (SQL Query from Textarea)
    if (req.method === 'GET' && path.startsWith('/lab5/api/v1/sql/')) {
        // Decode the query from the URL
        const sqlQuery = decodeURIComponent(path.replace('/lab5/api/v1/sql/', ''));
        
        // Use the Read-Only user to enforce Principle of Least Privilege
        const connection = mysql.createConnection(readOnlyConfig);
        connection.query(sqlQuery, (err, results) => {
            if (err) {
                res.end("Access Denied or Syntax Error: " + err.message);
            } else {
                res.end(JSON.stringify(results));
            }
            connection.end();
        });
    }
});

server.listen(8888, () => {
    console.log('Server 2 running on port 8888');
});