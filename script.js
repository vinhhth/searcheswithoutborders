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
    $("#progress-ind").hide();
      
    $("#output-trans").html("");
    $("#output-reg").html("");
    var results = result.split("<br>");
    for (var i = 0; i < results.length; i++) {
        if (results[i].indexOf("tr4nsl4ted") == 0) {
            $("#output-trans").append(bootstrap_list_item + decodeURIComponent(decodeURIComponent(results[i].substring(10))) + "</li>");
        } else {
            $("#output-reg").append(bootstrap_list_item + decodeURIComponent(decodeURIComponent(results[i])) + "<br>");
        }
    }
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
        // asynchronous http request
        $.ajax({
            url: URL + query,
            data: query,
            success: receivedInformation,
            error: serverError
        });
    }
});