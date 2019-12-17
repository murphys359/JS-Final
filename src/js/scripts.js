
/* This is my first code
 * this is what it does
 */

console.log("Hello World");

function tt0(testv = 4) {
  console.log('testv',testv);
}

function getDoggos() {
	//fetches random dog
	fetch('https://dog.ceo/api/breeds/image/random').then(function (resp) {
		//converts to json and then log json data 
    resp.json().then(function (json_data) {
      console.log(json_data);
 	  sendDog(json_data);
    });
  });
}

function sendDog(json_data) {
	//post request: send info to server
	//tells server to dog image and phone number 
	if(validatePhone(document.getElementById('phone').value)) {
		fetch('/send_sms', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
      	//url to dog and phone number
        url: json_data.message,
        phone: replaceAll(document.getElementById('phone').value, "-","")
      })
    }).then(function (resp) {
      resp.json().then(function (json_data) {
        if (json_data.status == 'success') {
          document.getElementById('success').innerHTML = "Sent the dog!";
          document.getElementById('error').innerHTML = "";
        } else {
          error_message_1();
        }
      });
    });
	} 
	else {
		document.getElementById('success').innerHTML = "";
        document.getElementById('error').innerHTML = "Invalid Phone Number!";
	}


	
}

function error_message_1(error) {
  document.getElementById('success').innerHTML = "";
  document.getElementById('error').innerHTML = "Error! Issue sending message. Check your phone number!";
}








