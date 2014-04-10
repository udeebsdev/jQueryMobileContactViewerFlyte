var _apiKey = 'flyte';
var _contacts = null;
var _currentContactId = null;
var _currentContact = null;

function getContacts(callbackFn) {
    $.get('http://contacts.tinyapollo.com/contacts?key=' + _apiKey, function (data) {
        _contacts = data.contacts;
        callbackFn();
    });
};

function getContactItem(callbackFn) {
    $.get('http://contacts.tinyapollo.com/contacts/'+_currentContactId+'?key=' + _apiKey, function (data) {
        _currentContact = data.contact;
        callbackFn();
    });
};


$(document).on("pagebeforeshow", "#home", function () {
    var $contactList = $("#contact-list");
    $contactList.html('');
    getContacts(function () {
        for (var i in _contacts) {
            var contact = _contacts[i];
            $contactList.append('<li class="contactItem" data-id="' + contact._id + '"><a href="#contactDetailPage">' + contact.name + '</a><li>');
        }
        $contactList.listview('refresh');

        $contactList.find('li.contactItem').on("click", function (event) {
            _currentContactId = event.currentTarget.attributes.getNamedItem("data-id").value;
        });
    });

});

$(document).on("pagebeforeshow", "#contactDetailPage", function (event) {
    var $contactDetails = $('#contactDetailPage')
    getContactItem(function(){
        $contactDetails.find('#contactName')[0].innerText =_currentContact.name;
        $contactDetails.find('#contactTitle')[0].innerText = _currentContact.title;
        $contactDetails.find('#contactPhone')[0].innerText = _currentContact.phone;
        $contactDetails.find('#contactEmail')[0].innerText = _currentContact.email;
        $contactDetails.find('#contactHandle')[0].innerText = _currentContact.twitterId;
    });
});