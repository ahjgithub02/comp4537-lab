import mysql from 'mysql2';
import url from 'url';

export class DatabaseServer {
    constructor() {
        this.dbConfig = {
            host: process.env.DB_HOST, // Set this in DigitalOcean Environment Variables
            database: 'comp4537_lab',
            port: 3306
        };
        // Least Privilege credentials
        this.adminAuth = { user: 'lab_admin', password: 'admin_password_123' };
        this.readOnlyAuth = { user: 'lab_read_only', password: 'guest_password_123' };
    }

    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const path = parsedUrl.pathname;

        if (req.method === 'POST' && path.includes('/api/v1/sql')) {
            this.handleInsert(req, res);
        } else if (req.method === 'GET' && path.includes('/api/v1/sql/')) {
            this.handleQuery(req, res, path);
        } else {
            res.writeHead(404);
            res.end("Lab 5 Path Not Found");
        }
    }

    handleInsert(req, res) {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const conn = mysql.createConnection({ ...this.dbConfig, ...this.adminAuth });
            
            // Requirement: Use ENGINE=InnoDB
            const createTable = `CREATE TABLE IF NOT EXISTS patient (
                patient_id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                date_of_birth DATE
            ) ENGINE=InnoDB;`;

            conn.query(createTable, (err) => {
                if (err) { res.end("Error creating table"); return; }
                
                const patients = JSON.parse(body);
                const values = patients.map(p => [p.name, p.dateOfBirth]);
                const insertQuery = "INSERT INTO patient (name, date_of_birth) VALUES ?";
                
                conn.query(insertQuery, [values], (err) => {
                    res.writeHead(200);
                    res.end(err ? "Insert error" : "Data inserted successfully.");
                    conn.end();
                });
            });
        });
    }

    handleQuery(req, res, path) {
        const sqlQuery = decodeURIComponent(path.split('/sql/')[1]);
        
        // Security requirement: Use Read-Only user for SELECT
        const conn = mysql.createConnection({ ...this.dbConfig, ...this.readOnlyAuth });
        
        conn.query(sqlQuery, (err, results) => {
            res.writeHead(err ? 403 : 200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(err ? { error: "Access Denied: " + err.message } : results));
            conn.end();
        });
    }
}