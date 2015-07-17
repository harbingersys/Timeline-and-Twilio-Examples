/*
  Important Note : In order to test twilio call add your phon enumber 
  to the below varibale ex : mobile = "+919898989898";
*/

var mobile = "+919898989898"; // Please hard code your number with country code

/* --------------- Ready Event Listener --------------- */
Pebble.addEventListener('ready', function() {
  console.log('JS: PebbleKit JS ready!');
  
  var dict = {
    'READY_KEY':'READY'
  };
  
  var transactionId = Pebble.sendAppMessage(dict, function(e) {
      console.log('JS: Successfully delivered READY message with transactionId='+ e.data.transactionId);
    },
    function(e) {
     console.log('JS: Unable to deliver READY message with transactionId='+ e.data.transactionId+ ' Error is: ' + e.error.message);
    }
  );
  
});


/* ---------- Listen for incoming msgs from Pebble C ---------------- */
Pebble.addEventListener('appmessage',
  function(e) {
    console.log('JS: Received App message: ' + JSON.stringify(e.payload));
    
    var json = e.payload;
    
    if(json.PUSH_PINS_KEY) 
    	{
    		push_pins_on_user_request();
    	}
    else if(json.MOVIE_REPLY_KEY) 
    	{
        var value = json.MOVIE_REPLY_KEY;
        make_twilio_call(value);
    	}
  }
);

var xhrRequest = function (url, type, callback, data) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function (response) {
    callback(xhr.responseText);
  };
  
    xhr.open(type, url+data);  
    xhr.send();
};

function make_twilio_call(movie_reply)
{
  var encoded_mobile=encodeURIComponent(mobile);
  
  var url='http://mytwiliocall.byethost7.com/twilio-call/twilio_demo.php?mobile='+encoded_mobile+'&movie_reply='+movie_reply;  
  xhrRequest(url, 'GET', function(response) 
              {
                console.log('JS: Placed a Twilio call');
               });
}

function push_pins_on_user_request()
{
  create_sports_pin();
  create_weather_pin();
  create_generic_pin();
  create_calendar_pin();
}

/* ----------------- Generic Pin Layout ---------------- */
function create_generic_pin()
{
  // An hour ahead
  var date = new Date();
  date.setHours(date.getHours() + 1);
  var time_str= date.toISOString();
  
  // Create the pin
  var pin = {
    "id": "pin-" + Math.round((Math.random() * 100000)),
    "time": time_str,
    "layout": {
      "type": "genericPin",
      "title": "Movie with Alice",
      "body": "PVR Multiplex",
      "tinyIcon": "system://images/TV_SHOW",
      "primaryColor": "#FFFFFF",
      "secondaryColor": "#000000",
      "backgroundColor": "#FF5555"
    },
    "actions": [
      {
        "title": "I will join",
        "type": "openWatchApp",
        "launchCode": 1
      },
      {
        "title": "Can't join",
        "type": "openWatchApp",
        "launchCode": 2
      },
      {
        "title": "Not sure right now",
        "type": "openWatchApp",
        "launchCode": 3
      }  
]
  };

  console.log('Inserting pin in the future: ' + JSON.stringify(pin));

  insertUserPin(pin, function(responseText) { 
    console.log('Response of inserting pin: ' + responseText);
  });
}


/*---------------- Calendar Pin Layout ------------------- */
function create_calendar_pin()
{
  // An hour ahead
  var date = new Date();
  date.setHours(date.getHours() + 2);
  var time_str= date.toISOString();
  date.setMinutes(date.getMinutes() - 10);
  var reminder_time_str = date.toISOString();
  
  // Create the pin
  var pin = {
    "id": "pin-" + Math.round((Math.random() * 100000)),
    "time": time_str,
    "layout": {
      "type": "calendarPin",
      "title": "Meeting",
      "locationName": "Conference Room 1",
      "body": "Pebble Discussion & Demo",
      "tinyIcon": "system://images/TIMELINE_CALENDAR",
      "primaryColor": "#FFFFFF",
      "secondaryColor": "#000000",
      "backgroundColor": "#00AAFF"
    },
    "reminders": [
      {
        "time": reminder_time_str,
        "layout": {
        "type": "genericReminder",
        "tinyIcon": "system://images/NOTIFICATION_GENERIC",
        "title": "Meeting in 5 minutes"
        }
      }
    ]  
  };

  console.log('Inserting pin in the future: ' + JSON.stringify(pin));

  insertUserPin(pin, function(responseText) { 
    console.log('Response of inserting pin: ' + responseText);
  });
}


/* -------------- Sports Pin Layout ------------------- */
function create_sports_pin()
{
  // An hour ahead
  var date = new Date();
  date.setMinutes(date.getMinutes() +2);
  var time_str= date.toISOString();
  
  // Create the pin
  var pin = {
  "id": "pin-" + Math.round((Math.random() * 100000)),
  "time": time_str,
  "layout": {
    "type": "sportsPin",
    "title": "Football Match",
    "subtitle": "Half Time",
    "body": "Game of the Century",
    "tinyIcon": "system://images/AMERICAN_FOOTBALL",
    "largeIcon": "system://images/AMERICAN_FOOTBALL",
    "rankAway": "03",
    "rankHome": "08",
    "nameAway": "CHEL",
    "nameHome": "LIV",
    "recordAway": "39-19",
    "recordHome": "39-21",
    "scoreAway": "54",
    "scoreHome": "49",
    "sportsGameState": "in-game",
    "primaryColor": "#FFFFFF",
    "secondaryColor": "#000000",
    "backgroundColor": "#00AA00"
  }
};

  console.log('Inserting pin in the future: ' + JSON.stringify(pin));

  insertUserPin(pin, function(responseText) { 
    console.log('Response of inserting pin: ' + responseText);
  });
}

/* ------------ Weather Layout Pin -------------- */
function create_weather_pin()
{
  // An hour ahead
  var date = new Date();
  date.setMinutes(date.getMinutes() +5);
  var time_str= date.toISOString();
  
  // Create the pin
  var pin = {
    "id": "pin-" + Math.round((Math.random() * 100000)),
    "time": time_str,
    "layout": {
    "type": "weatherPin",
    "title": "Nice day",
    "subtitle": "40/65",
    "tinyIcon": "system://images/TIMELINE_SUN",
    "largeIcon": "system://images/TIMELINE_SUN",
    "locationName": "London",
    "body": "Sunny with a chance of rain.",
    "primaryColor": "#FFFFFF",
    "secondaryColor": "#FFFFFF",
    "backgroundColor": "#FFAA00"
    }
  };

  console.log('Inserting pin in the future: ' + JSON.stringify(pin));

  insertUserPin(pin, function(responseText) { 
    console.log('Response of inserting pin: ' + responseText);
  });
}


// The timeline public URL root
var API_URL_ROOT = 'https://timeline-api.getpebble.com/';

/*
 * Send a request to the Pebble public web timeline API.
 * @param pin The JSON pin to insert. Must contain 'id' field.
 * @param type The type of request, either PUT or DELETE.
 * @param callback The callback to receive the responseText after the request has completed.
 */

function timelineRequest(pin, type, callback) {
  
  var url = API_URL_ROOT + 'v1/user/pins/' + pin.id;
  // Create XHR
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    console.log('Timeline: response received: ' + this.responseText);
    callback(this.responseText);
  };
  xhr.open(type, url);

  // Get Timeline token
  Pebble.getTimelineToken(function(token) {
    // Add headers
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-User-Token', '' + token);

    // Send
    xhr.send(JSON.stringify(pin));
    console.log('Timeline: request sent.');
  }, function(error) { 
        console.log('Timeline: error getting timeline token: ' + error);
    });
}


/*
 * Insert a pin into the timeline for this user.
 * @param pin The JSON pin to insert.
 * @param callback The callback to receive the responseText after the request has completed.
 */

function insertUserPin(pin, callback) {
  timelineRequest(pin, 'PUT', callback);
}

/*
 * Delete a pin from the timeline for this user.
 * @param pin The JSON pin to delete.
 * @param callback The callback to receive the responseText after the request has completed.
 */

function deleteUserPin(pin, callback) {
  timelineRequest(pin, 'DELETE', callback);
}

