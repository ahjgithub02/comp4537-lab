import http from 'http';
import { APIServer } from './COMP4537/labs/3/server.js';
import { DatabaseServer } from './COMP4537/labs/lab5/server2/server.js';

// Instantiate the classes
const lab3App = new APIServer();
const lab5App = new DatabaseServer();

const server = http.createServer((req, res) => {
    // Required CORS headers for cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Route based on URL content
    if (req.url.includes('/labs/3/')) {
        lab3App.handleRequest(req, res);
    } else if (req.url.includes('/lab5/')) {
        lab5App.handleRequest(req, res);
    } else {
        res.writeHead(404);
        res.end("Global Route Not Found");
    }
});

server.listen(8888, () => console.log("OOP Monolith running on 8888"));