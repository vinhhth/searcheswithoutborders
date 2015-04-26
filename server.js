// run using 'node server.js'

var PORT = 8000;
var ADDRESS = '127.0.0.1';

// this function specifies how our http server deals with a request
function processRequest(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');
}


var http = require('http');

var server = http.createServer();

server.listen(PORT, ADDRESS);

// tell our http server how to deal with a request (e.g. using processRequest)
server.addListener("request", processRequest);

console.log("Server running at http://" + ADDRESS + ":" + PORT + "/");
