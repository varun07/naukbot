

'use strict';

var apiai = require('apiai');
var apiaiRequest = apiai("f4e49ed51bdd4128b4dbd4f23ad973b5");
const uuidv1 = require('uuid/v1');

const 
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json()); // creates express http server

var router = express.Router();
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Sets server port and logs message on success
// app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

const INTENTS = {
  WALKIN: ''
};

// Accepts POST requests at /webhook endpoint
router.post('/', (req, res) => {  

  let body = req.body;
  if (body.object === 'page') {
    body.entry.forEach(function(entry) {
      let webhook_event = entry.messaging[0];

      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      if (webhook_event.message) {

        sendTypingOn(sender_psid);
        var request = apiaiRequest.textRequest(webhook_event.message.text, { sessionId: uuidv1() });
        request.on('response', function(response) {
          console.log('apiai response successful');
          console.log('response', response);
          const result = response.result.fulfillment.speech;

        //   handleMessage(sender_psid, result);
        //   return;
          showWalkinList(sender_psid, getWalkIn());
          return;
          // if(response.result.intent === INTENTS.WALKIN){
          //   showWalkinList(getWalkIn());
          //   return;
          // }
          //handleMessage(sender_psid, result);       
        });
      
        request.on('error', (error) => console.log('errror', error));
        request.end();
         
      } 
      else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
      
    });

    res.status(200).send('EVENT_RECEIVED');

  } else {
    res.send("Subscribe please");
    res.end();
  }

});

function showWalkinList(senderId, walkins){

  let elements = walkins.map((walkin)=> {
    return {
      title: walkin.organization,
      subtitle: walkin.jobTitle,
      "buttons": [
        {
          "title": "Interested",
          "type": "web_url",
          "url": "https://peterssendreceiveapp.ngrok.io/collection",
          "messenger_extensions": true,
        }
      ],
      "default_action": {
        "type": "web_url",
        "url": "https://peterssendreceiveapp.ngrok.io/view?item=100",
        "messenger_extensions": false,
      }
    }
  });

  let responseBody = {

    "recipient":{
      "id":senderId
    }, 
    "message": {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "list",
          "top_element_style": "compact",
          "elements": elements
        }
      }
    }
  };

  responseBody = { 
    "recipient": { 
      "id": senderId
    },
    "message": {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "list",
          "top_element_style": "compact",
          "elements": [
            {
                "title": "Software Engineer",
                "subtitle": "InfoEdge India Limited",
                "buttons":[
                    {
                    "type":"web_url",
                    "url":"https://www.messenger.com",
                    "title":"Interested"
                    }
                ],
                "default_action": {
                    "type": "web_url",
                    "url": "https://naukbot.herokuapp.com/app?id=1",
                    "messenger_extensions": false,
                    "webview_height_ratio": "tall"
                }
            },
            {
                "title": "Senior Software Engineer",
                "subtitle": "Adobe India Limited",
                "buttons":[
                    {
                    "type":"web_url",
                    "url":"https://www.messenger.com",
                    "title":"Interested"
                    }
                ],
                "default_action": {
                    "type": "web_url",
                    "url": "https://naukbot.herokuapp.com/app?id=2",
                    "messenger_extensions": false,
                    "webview_height_ratio": "tall"
                }
            }
          ]
        }
      }
    }
  };
  

  console.log('showWalkinList - end');
  sendToFacebook(responseBody);    
}

router.get('/', (req, res) => {
  
  const VERIFY_TOKEN = PAGE_ACCESS_TOKEN;
  
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  if (mode && token) {
  
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } 
    else {
      res.sendStatus(403);      
    }
  }
});

router.get('/test', (req, res) => {
  
  res.send({
    name: 'successful request'
  });

  res.end();
});

router.get('/walkin', (req, res) => {
  res.send('walkin');
  res.end();

  res.send(getWalkIn());
  res.end();
});

function getWalkIn(){
  return [
    {
      jobTitle: 'Software Engineer',
      organization: 'InfoEdge India Limited',
      location: 'Noida B-8'
    },
    {
      jobTitle: 'Software Engineer',
      organization: 'InfoEdge India Limited',
      location: 'Noida B-8'
    }
  ];
}

function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  sendToFacebook(request_body);
}

function sendToFacebook(request_body){
  console.log(request_body);
  request({
      "uri": "https://graph.facebook.com/v2.6/me/messages",
      "qs": { "access_token": PAGE_ACCESS_TOKEN },
      "method": "POST",
      "json": request_body
    }, (err, res, body) => {
      if (!err) {
        console.log('message sent!')
      } else {
        console.error("Unable to send message:" + err);
      }
  }); 
}

function handleMessage(sender_psid, received_message) {

  let response;

  // Check if the message contains text
  if (received_message) {    

    // Create the payload for a basic text message
    response = {
      "text": received_message
    }
  }  
  console.log('handleMessage', response);
  callSendAPI(sender_psid, response);    
  
  // Sends the response message
  
}

function handlePostback(sender_psid, received_postback) {
  let response;
  
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

function sendTypingOn(senderId){
  const requestBody = {
    "recipient":{
      "id": senderId
    },
    "sender_action":"typing_on"
  };

  sendToFacebook(requestBody);
}

module.exports = router;