// this is the javascript for the HTML page

// this, of course, will need to be changed in the future lol
// the URL OF THE DATA SERVER !!
var URL = "http://127.0.0.1:9000/"

// code put here will run before the document is actually loaded

// this function is called once all the HTML is loaded
// this is the "main" method if you will
$(document).ready(function() {

});

// this is the ajax callback function
function receivedInformation(result, textStatus, jqXHR) {

	$("#output").append(result + "<br>");

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

	if(event.keyCode == 13 && query != "") {
		// asynchronous http request
		$.ajax({url: URL,
				data: query,
				success: receivedInformation,
				error: serverError
			   });
	}
});
