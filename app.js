const http = require('http');
const lab3 = require('./COMP4537/labs/3/server.js');
const lab5 = require('./COMP4537/labs/lab5/server2/server.js');

const server = http.createServer((req, res) => {
    if (req.url.startsWith('/lab3')) {
        // Route to Lab 3 logic
        lab3.handleRequest(req, res);
    } else if (req.url.startsWith('/lab5')) {
        // Route to Lab 5 logic
        lab5.handleRequest(req, res);
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
});

server.listen(8888);