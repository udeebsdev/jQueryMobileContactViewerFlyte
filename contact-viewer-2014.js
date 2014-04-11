var _apiKey = 'flyte';
var _contacts = null;
var _currentContactId = null;
var _currentContact = null;

//Fetch a list of contacts
function getContacts(callbackFn) {
    var url = encodeURI('http://contacts.tinyapollo.com/contacts?key=' + _apiKey);
    $.get(url, function (data) {
        _contacts = data.contacts;
        callbackFn();
    });
};

//Fetch a single contact
function getContactItem(callbackFn) {
    var url = encodeURI('http://contacts.tinyapollo.com/contacts/' + _currentContactId + '?key=' + _apiKey);
    $.get(url, function (data) {
        _currentContact = data.contact;
        callbackFn();
    });
};

//Delete a contact
function deleteContact(callbackFn) {
    var url = encodeURI('http://contacts.tinyapollo.com/contacts/' + _currentContactId + '?key=' + _apiKey);
    $.ajax({url: url,
        type: 'DELETE',
        success: function (data) {
            callbackFn(data);
        }
    });
};

// Save the new contact
function saveNewContact(contact, callbackFn) {
    var url = encodeURI('http://contacts.tinyapollo.com/contacts?key=' + _apiKey + '&name=' + contact.name + '&title=' + contact.title + '&email=' + contact.email + '&phone=' + contact.phone + '&twitterId=' + contact.handle);
    $.post(url, function (data) {
        callbackFn();
    });
};

// Saving the current contact
function saveCurrentContact(contact, callbackFn) {
    var url = encodeURI('http://contacts.tinyapollo.com/contacts/' + _currentContactId + '?key=' + _apiKey + '&name=' + contact.name + '&title=' + contact.title + '&email=' + contact.email + '&phone=' + contact.phone + '&twitterId=' + contact.handle);
    $.ajax({url: url,
        type: 'PUT',
        data: "",
        success: function (data) {
            callbackFn(data);
        }
    });
};

function getCurrentContactIdFromUrl(data) {
    var parameters = $(this).data("url").split("?")[1];
    ;
    _currentContactId = parameters.replace("id=", "");
};


// Home screen of the app
$(document).on("pagebeforeshow", "#home", function () {
    var $contactList = $("#contact-list");
    $contactList.html('');

    // Display a list of all the contacts
    getContacts(function () {
        for (var i in _contacts) {
            var contact = _contacts[i];
            $contactList.append('<li class="contactItem" data-id="' + contact._id + '"><a>' + contact.name + '</a><li>');
            //href="contact-viewer-2014.html#contactDetailPage?id=' + contact._id + '"
        }
        $contactList.listview('refresh');

        $contactList.find('li.contactItem').on("click", function (event) {
            _currentContactId = event.currentTarget.attributes.getNamedItem("data-id").value;
//            $.mobile.changePage("#contactDetailPage?id=" + _currentContactId, { dataUrl : "contactDetailPage?id="+_currentContactId, data : { 'id' : _currentContactId}, reloadPage : true, changeHash : true });
            $.mobile.changePage("#contactDetailPage?id=" + _currentContactId);
        });
    });

});

// Contact Details page
$(document).on("pagebeforeshow", "#contactDetailPage", function (event, data) {
//    var parameters = $(this).data("url").split("?")[1];;
//    var parameter = parameters.replace("id=","");
//    getCurrentContactIdFromUrl(data);
    var $contactDetails = $('#contactDetailPage');
    if (_currentContactId) {
        // Populate the current contacts information
        getContactItem(function () {
            $contactDetails.find('#contactName')[0].innerText = _currentContact.name;
            $contactDetails.find('#contactTitle')[0].innerText = _currentContact.title;
            $contactDetails.find('#contactPhone')[0].innerText = _currentContact.phone;
            $contactDetails.find('#contactEmail')[0].innerText = _currentContact.email;
            $contactDetails.find('#contactHandle')[0].innerText = _currentContact.twitterId;
        });
    } else {
        alert("You need to select a contact before navigating to this page.");
        $.mobile.changePage("#home");

    }
});

// Edit Current Contact Page
$(document).on("pagebeforeshow", "#editContactPage", function (event) {
    var $contactDetails = $('#editContactPage');
    if (_currentContactId) {
        // Populate the page with right information when page loads
        getContactItem(function () {
            $contactDetails.find('#editContactName')[0].value = _currentContact.name;
            $contactDetails.find('#editContactTitle')[0].value = _currentContact.title;
            $contactDetails.find('#editContactPhone')[0].value = _currentContact.phone;
            $contactDetails.find('#editContactEmail')[0].value = _currentContact.email;
            $contactDetails.find('#editContactHandle')[0].value = _currentContact.twitterId;
        });

        //On save event handler
        $contactDetails.find('#editContactSave').on("click", function (event) {

            //make a json of the current contact with updated data to be saved.
            var contact = {
                name: $contactDetails.find('#editContactName')[0].value,
                title: $contactDetails.find('#editContactTitle')[0].value,
                phone: $contactDetails.find('#editContactPhone')[0].value,
                email: $contactDetails.find('#editContactEmail')[0].value,
                handle: $contactDetails.find('#editContactHandle')[0].value
            }

            // call to save the contact
            saveCurrentContact(contact, function (contact) {
                _currentContact = contact;
                _currentContactId = contact._id;
                alert("contact has been saved!");
                $.mobile.changePage("#contactDetailPage");
            });
        });

        // On delete event handler
        $contactDetails.find('#editContactDelete').on("click", function (event) {
            deleteContact(function () {
                alert("Contact has been deleted!");
                $.mobile.changePage("#home");
            });
        });
    } else {
        alert("You need to select a contact before navigating to this page.");
        $.mobile.changePage("#home");

    }
});

// New Contact Page
$(document).on("pagebeforeshow", "#newContactPage", function (event) {
    var $contactDetails = $('#newContactPage')

    //On save event handler
    $contactDetails.find('#newContactSave').on("click", function (event) {
        // make a json of the contact to be saved
        var contact = {
            name: $contactDetails.find('#newContactName')[0].value,
            title: $contactDetails.find('#newContactTitle')[0].value,
            phone: $contactDetails.find('#newContactPhone')[0].value,
            email: $contactDetails.find('#newContactEmail')[0].value,
            handle: $contactDetails.find('#newContactHandle')[0].value
        }

        // save a new contact
        saveNewContact(contact, function () {
            _currentContact = contact;
            _currentContactId = contact._id;
            alert("contact has been saved!");
            $.mobile.changePage("#contactDetailPage");
        });
    });
});