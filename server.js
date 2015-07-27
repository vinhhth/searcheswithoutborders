// run using 'node server.js'

var PORT = 8000;
var ADDRESS = '0.0.0.0';

// the node.js method of doing imports
var fs = require("fs");
var http = require("http");
var url = require("url");

// this function specifies how our http server deals with a request
function processRequest(request, response) {
	var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
	response.writeHead(200);

    if(pathname == "/") {
        html = fs.readFileSync("index.html", "utf8");
        response.write(html);
    } else if (pathname == "/script.js") {
        script = fs.readFileSync("script.js", "utf8");
        response.write(script);
    }
    response.end();
}

var server = http.createServer();
server.listen(PORT, ADDRESS);
// tell our http server how to deal with a request (e.g. using processRequest)
server.addListener("request", processRequest);
console.log("Server running at http://" + ADDRESS + ":" + PORT + "/");