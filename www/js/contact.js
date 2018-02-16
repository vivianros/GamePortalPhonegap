    
//var $ = require("jquery");      

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
   
    bindEvents: function() {
        document.addEventListener('deviceready', onDeviceReady, false);
    },

};

 function onDeviceReady() {           
        var options = new ContactFindOptions();      
        options.filter = "";     
        options.multiple = true;  
        var fields = ["displayName", "name", "phoneNumbers"];                  
        navigator.contacts.find(fields, onSuccess, onError, options);
    }   
          
         
function onSuccess(contacts) {
    alertContact(contacts);
}

function alertContact(contacts) {
    var aResult = [];
    for (var i = 0; contacts[i]; i++) {
        console.log("Display Name = " + contacts[i].displayName);   
  
        if (contacts[i].phoneNumbers && contacts[i].phoneNumbers.length) {
            var contactPhoneList =[];
            for (var j = 0; contacts[i].phoneNumbers[j]; j++) {
                contactPhoneList.push(
                    {
                        'type' :  contacts[i].phoneNumbers[j].type,
                        'value' : contacts[i].phoneNumbers[j].value
                    }
                    );
                };
                aResult.push({
                    name:contacts[i].displayName,
                    phone:contactPhoneList
                });
            };
        }
        var li = '';
        for (var i = 0; aResult[i]; i++) {
            for (var j = 0 ; aResult[i].phone[j]; j++) {
                alert(aResult[i].name +"--------"+ aResult[i].phone[j].type+"-----"+aResult[i].phone[j].value);
                li += '<li style="text-decoration:none;">'+aResult[i].name+' '+aResult[i].phone[j].value+'</li>';
            };
        };
        $("#contact").html(li);

    }     

  function onError(contactError) {
      alert('onError!');
    }     

  function intent(){
      onDeviceReady();
    }
      
