// run using 'node data_server.js'

var PORT = 9000;
var ADDRESS = '127.0.0.1';
var google = require('google')

// the node.js method of doing imports
var fs = require("fs");
var http = require("http");
var url = require("url");
var translate = require('yandex-translate-api')('trnsl.1.1.20150513T030345Z.73125b8d84a36fdf.e679ee68e06b6ae0164b792048951a1342cd12fd');
var cheerio = require('cheerio');
var nextCounter = 0;
var nextCounter2 = 0;
// function baidu(request,response)
// {
//     http.get({
//         host: 'www.google.com.hk',
//         path: '/search?q=' + request
//     }, function(res) {
//         // Continuously update stream with data
//         var body = '';
//         res.on('data', function(d) {
//             body += d;
//         });
//         res.on('end', function() {

//             // Data reception is done, do whatever with it!
//             //var parsed = JSON.parse(body);
//             var $ = cheerio.load(body);
//             var actualData = $("#res")[0];
//             $ = cheerio.load(actualData);
//             //$("#imagebox_bigimages").remove();
//             //console.log(actualData);

//             $('a').each(function(index) {
//                 var url = this.attribs.href;
//                 if (url.substring(0, 7) == "/url?q=") {
//                     var index = url.indexOf("&sa");
//                     var cleanedURL = url.substring(7, index);
//                     cleanedURL = cleanedURL.replace(/%3F/g, "?");
//                     cleanedURL = cleanedURL.replace(/%3D/g, "=");
//                     cleanedURL = cleanedURL.replace(/%23/g, "#");
//                     cleanedURL = cleanedURL.replace(/%26/g, "&");

//                     if (cleanedURL.indexOf("webcache.googleusercontent.com") == -1 && cleanedURL.indexOf("/settings/ads/preferences") == -1)
//                         response.write(cleanedURL + "<br>");
//                 }
//                 //response.write(this.attribs.href + "<br>");
//             });
//             //console.log(body);
//             //response.write(body);
//             response.end();
//         });
//     }).on('error', function(e) {
//         console.log("Got error: " + e.message);
//     });
// }


function respond(response, lang, query, type, next_r){
    type = type || ""; 
    google.resultsPerPage = 25
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

        console.log(links);

        for (var i = 0; i < links.length; ++i) {
            if("link" in links[i] && links[i].link)
            {    
                response.write(type + "<h3> <a target='_blank' href='" +  links[i].link + "'>" +  links[i].title + "</a> </h3>");
                response.write("<p>" + links[i].description + "</p>");  
                response.write("<h6> <a target='_blank' href='" + links[i].link + "'>" +  links[i].link  + "</a> </h6>");
                response.write("<br>");
            }

        }
      

        if(next_r !== undefined)
            next_r(response);
    });
    nextCounter = 0;
// http.get({
//     host: 'www.google.com',
//     path: '/search?q=' + raw_query
// }, function(res) {
//     // Continuously update stream with data
//     var body = '';
//     res.on('data', function(d) {
//         body += d;
//     });
//     res.on('end', function() {

//         // Data reception is done, do whatever with it!
//         //var parsed = JSON.parse(body);
//         var $ = cheerio.load(body);
//         var actualData = $("#res")[0];
//         $ = cheerio.load(actualData);
//         //$("#imagebox_bigimages").remove();
//         //console.log(actualData);
//         var ith = 0;
//         $('a').each(function(i, el) {
//             var url = this.attribs.href;
//             if (url.substring(0, 7) == "/url?q=") {
//                 var index = url.indexOf("&sa");
//                 var cleanedURL = url.substring(7, index);
//                 cleanedURL = cleanedURL.replace(/%3F/g, "?");
//                 cleanedURL = cleanedURL.replace(/%3D/g, "=");
//                 cleanedURL = cleanedURL.replace(/%23/g, "#");
//                 cleanedURL = cleanedURL.replace(/%26/g, "&");

//                 if (cleanedURL.indexOf("webcache.googleusercontent.com") == -1 && cleanedURL.indexOf("/settings/ads/preferences") == -1)
//                     response.write(type + cleanedURL + "<br>");

//                 ith++;
//             }
//             //response.write(this.attribs.href + "<br>");
//         });
//         //console.log(body);
//         //response.write(body);
//         if(next !== undefined)
//             next(response);
//     });
// }).on('error', function(e) {
//     console.log("Got an error with google search: " + e.message);
// });

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

    response.writeHead(200);

    var raw_query = pathname.substring(1, pathname.length);

    var query = raw_query.replace(/%20/g, " ");

    respond(response, 'en', raw_query);
    setTimeout(function(){
        translate.translate(query, { to: 'zh' }, function(err, res) {
            var query2 = res.text;
            respond(response, 'hk', query2, "tr4nsl4ted", function(res){ res.end(); } );
        });
    }, 2000);



    // console.log("out\t" + query2)

    // response.write("You submitted the query: " + query);

    
}

var server = http.createServer();

server.listen(PORT, ADDRESS);

// tell our http server how to deal with a request (e.g. using processRequest)
server.addListener("request", processRequest);

console.log("Server running at http://" + ADDRESS + ":" + PORT + "/");
