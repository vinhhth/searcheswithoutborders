// run using 'node data_server.js'

var PORT = 9000;
var ADDRESS = '0.0.0.0';
var google = require('google')

// the node.js method of doing imports
var fs = require("fs");
var http = require("http");
var url = require("url");
var translate = require('yandex-translate-api')('trnsl.1.1.20150513T030345Z.73125b8d84a36fdf.e679ee68e06b6ae0164b792048951a1342cd12fd');
var cheerio = require('cheerio');
var nextCounter = 0;

var jsonToRespond = [];

function respond(response, lang, query, type, next_r){
    type = type || ""; 
    google.resultsPerPage = 25
    google.requestOptions = {
    headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive',
    }
    }
    if(lang !== 'en')
    {
        google.lang = lang
        google.tld = lang
        google.nextText = '下一页'
    }
    google(query, function (err, next, links){
        if(err){
            console.log("Got an error with google search: " + err.message);
            if(next_r !== undefined){
                next_r(response);
            }
        }

        for (var i = 0; i < links.length; ++i) {
            if("link" in links[i] && links[i].link)
            {   
                console.log(JSON.stringify(links[i]));
                links[i].translated = (type == "tr4nsl4ted") ? true : false;
                jsonToRespond.push(links[i]);
            }

        }

        if(next_r !== undefined)
            next_r(response);
    });
    nextCounter = 0;

}
// this function specifies how our http server deals with a request
function processRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

    // just ignore this bullshit. DO NOT delete it.
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.setHeader('Access-Control-Allow-Credentials', true);
    response.setHeader('Content-Type', 'application/json');

    response.writeHead(200);
    jsonToRespond = [];
    var raw_query = pathname.substring(1, pathname.length);

    var query = decodeURIComponent(raw_query);

    respond(response, 'en', query);
    setTimeout(function(){
        translate.translate(query, { to: 'zh' }, function(err, res) {
            var query2 = res.text;
            respond(response, 'hk', query2, "tr4nsl4ted", function(res){ 
                res.write(JSON.stringify(jsonToRespond));
                res.end(); 
                console.log("DONE WRITING");
            });
        });
    }, 2000);
    
}

var server = http.createServer();

server.listen(PORT, ADDRESS);

// tell our http server how to deal with a request (e.g. using processRequest)
server.addListener("request", processRequest);

console.log("Server running at http://" + ADDRESS + ":" + PORT + "/");
