// this is the javascript for the HTML page

// this, of course, will need to be changed in the future lol
// the URL OF THE DATA SERVER !!
var URL = "http://127.0.0.1:9000/"

// code put here will run before the document is actually loaded

// this function is called once all the HTML is loaded
// this is the "main" method if you will
$(document).ready(function() {

});
var bootstrap_list_item = "<li" + " class='list-group-item'>";
// this is the ajax callback function
function receivedInformation(result, textStatus, jqXHR) {
    console.log("receivedInformation");
    console.log(JSON.parse(result));
}

// this is the ajax callback function on fail
function serverError(jqXHR, textStatus, errorThrown) {

    $("#output").append("Error on server side. " + textStatus + " " + errorThrown + "<br>");
}

// technically, we could also do
// $('input').on('change', function()
// but this one is more general

$(document).on('keyup', '#queryInput', function(event) {
    var query = $("#queryInput").val();

    if (event.keyCode == 13 && query != "") {
        $("#progress-ind").show();
        $("#output-trans").html("");
        $("#output-reg").html("");
        // asynchronous http request
        $.getJSON(URL + query, query, function(data, textStatus) {
            $("#progress-ind").hide();

            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var htmlToAppend = bootstrap_list_item +
                    "<h3> <a href='" + item.link + "'>" + item.title + "</a> </h3>" +
                    "<p>" + item.description + "</p>" +
                    "<h6> <a href='" + item.link + "'>" + item.link + "</a> </h6>" +
                    "</li>";
                if (item.translated) {
                    $("#output-trans").append(htmlToAppend);
                } else {
                    $("#output-reg").append(htmlToAppend);
                }
            }
        });
    }
});