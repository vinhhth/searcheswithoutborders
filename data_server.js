// run using 'node data_server.js'

var PORT = 9000;
var ADDRESS = '127.0.0.1';

// the node.js method of doing imports
var fs = require("fs");
var http = require("http");
var url = require("url");

// this function specifies how our http server deals with a request
function processRequest(request, response) {
	var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

	// just ignore this bullshit. DO NOT delete it.
	response.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
	response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	response.setHeader('Access-Control-Allow-Credentials', true);

	response.writeHead(200);

    if(pathname == "/") {
        response.write("This is the data server speaking.");
    }

    response.end();
}


var server = http.createServer();

server.listen(PORT, ADDRESS);

// tell our http server how to deal with a request (e.g. using processRequest)
server.addListener("request", processRequest);

console.log("Server running at http://" + ADDRESS + ":" + PORT + "/");
