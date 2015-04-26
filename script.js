// this is the javascript for the HTML page

// code put here will run before the document is actually loaded

// this function is called once all the HTML is loaded
// this is the "main" method if you will
$(document).ready(function() {
	alert("document is ready. front end javascript call.");

});


// technically, we could also do
// $('input').on('change', function()
// but this one is more general

$(document).on('change', '#queryInput', function() {
	alert("you have submitted something");

});
