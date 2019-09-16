
const path = require('path');
const bodyParser = require('body-parser');
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
//serve static files on the server
app.use(express.static(__dirname));

var Stomp = require('stompjs')
var SockJS = require('sockjs-client')
var url = 'http://localhost:8090/websocket/tracker';

var sock= new SockJS(url);

//opens index.html
app.get('/',(req,res) => {

	res.sendFile(__dirname +"/index.html");
	
});

//start Webserver on Port 8000

var callback = function(message){
    
  console.log(message.body);
    io.emit('chatmessage', message.body);
};
 
io.on('connection', function(socket){
    console.log('a user connected');
     
});

sock.onopen = function() {
    console.log('open');
};

sock.onmessage = function(e) {
    console.log('message', e.data);
   // sock.close();
};

sock.onclose = function() {
    console.log('close');
};

var stompClient = Stomp.over(sock);
stompClient.connect({},function (frame) {
    console.log('connecting to '+url);
    console.log("stompConnected");
    
    //callback to track sent messages
    stompClient.subscribe('/topic/visComp',callback);
   
});
http.listen(8200,function(){
   console.log("app listen 8200"); 
});





