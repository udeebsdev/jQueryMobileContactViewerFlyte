var _apiKey ='flyte';
var _contacts =null;

function getContacts(cb){
	$.get('http://contacts.tinyapollo.com/contacts?key='+_apiKey, function (data){
		_contacts = data.contacts;
		cb();
	});

	
}


$(document).on("pagebeforeshow", "#home", function() {
	var contactList = $("#contact-list");
	contactList.html('');
	getContacts(function(){
		for (var i in _contacts){
			var contact = _contacts[i];
			contactList.append('<li><a>'+contact.name+'</a><li>');
		}
		contactList.listview('refresh');
	});
})