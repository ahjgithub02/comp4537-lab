import { STRINGS } from "./lang/en/en.js";
import { getDateAndTime } from "./modules/utils.js";
import http from 'http';
import url from 'url';
import fs from 'fs';

class APIServer {
    constructor(port) {
        this.port = port;
    }
        

    start() {
        http.createServer((req, res) => {
            this.handleRequest(req, res)
        }).listen(this.port, () => {
            console.log(`Server running on http://localhost:${this.port}`);
        });
    }

    handleRequest(req, res) {
        const q = url.parse(req.url, true);

        if (q.pathname.includes("/COMP4537/labs/3/getDate/")) {
            this.handleGetDate(q, res);
        }
        else if (q.pathname.includes("/COMP4537/labs/3/writeFile/")) {
            this.handleWriteFile(q, res);
        }
        else if (q.pathname.includes("/COMP4537/labs/3/readFile/")) {
            this.handleReadFile(q, res);
        } else {
            res.writeHead(404);
            res.end("Not Found");
        }
    }

    handleGetDate(q, res) {
        const name = q.query.name;
        const currentDate = getDateAndTime();
        const msg = `${STRINGS.GREETING}${name}${STRINGS.SMALL_TALK.replace("()", currentDate)}`;

        res.writeHead(200, {
            "Content-Type": "text/html",
            "Access-Control-Allow-Origin": "*"
        });
        res.end(`<div style="color:blue">${msg}</div>`);
    }

    handleWriteFile(q, res) {
        const text = q.query.text;

        fs.appendFile('File.txt', text + '\n', (err) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error writing to file");
            }
            else {
                res.writeHead(200, {'Content-Type': "text/plain"});
                res.end(`Appended: ${text} to File.txt`); 
            }
        });
    }

    handleReadFile(q, res) {
        const pathParts = q.pathname.split('/');
        const fileName = pathParts[pathParts.length - 1];

        fs.readFile(fileName, 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end(`404 Not Found: ${fileName}`);
            } else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(data);
                res.end();
            }
        });
    }
}


const server = new APIServer(8888); 
server.start();

// chatgpt 5.2 was used in modifing the provided lecture code for creating a basic server