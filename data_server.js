// run using 'node data_server.js'

var PORT = 9000;
var ADDRESS = '127.0.0.1';

// the node.js method of doing imports
var fs = require("fs");
var http = require("http");
var url = require("url");

var cheerio = require('cheerio');

// this function specifies how our http server deals with a request
function processRequest(request, response) {
	var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

    // just ignore this bullshit. DO NOT delete it.
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.setHeader('Access-Control-Allow-Credentials', true);

    response.writeHead(200);

    var raw_query = pathname.substring(1, pathname.length);

    var query = raw_query.replace(/%20/g, " ");

    // response.write("You submitted the query: " + query);

    http.get({
        host: 'www.google.com',
        path: '/search?q=' + raw_query
    }, function(res) {
        // Continuously update stream with data
        var body = '';
        res.on('data', function(d) {
            body += d;
        });
        res.on('end', function() {

            // Data reception is done, do whatever with it!
            //var parsed = JSON.parse(body);
            var $ = cheerio.load(body);
            var actualData = $("#res")[0];
            $ = cheerio.load(actualData);
            //$("#imagebox_bigimages").remove();
            //console.log(actualData);

            $('a').each(function(index) {
                var url = this.attribs.href;
                if (url.substring(0, 7) == "/url?q=") {
                    var index = url.indexOf("&sa");
                    var cleanedURL = url.substring(7, index);
                    cleanedURL = cleanedURL.replace(/%3F/g, "?");
                    cleanedURL = cleanedURL.replace(/%3D/g, "=");
                    cleanedURL = cleanedURL.replace(/%23/g, "#");
                    cleanedURL = cleanedURL.replace(/%26/g, "&");

                    if (cleanedURL.indexOf("webcache.googleusercontent.com") == -1 && cleanedURL.indexOf("/settings/ads/preferences") == -1)
                        response.write(cleanedURL + "<br>");
                }
                //response.write(this.attribs.href + "<br>");
            });
            //console.log(body);
            //response.write(body);
            response.end();
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });;

}


var server = http.createServer();

server.listen(PORT, ADDRESS);

// tell our http server how to deal with a request (e.g. using processRequest)
server.addListener("request", processRequest);

console.log("Server running at http://" + ADDRESS + ":" + PORT + "/");
