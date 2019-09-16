const express = require('express');
const expressServer = express();
const app = require("http").Server(expressServer);
const path = require('path');
const bodyParser = require('body-parser');

var request = require("request");

const opcua = require("node-opcua");

/*
*
*Websocket config
*
*/
var Stomp = require('stompjs')
var SockJS = require('sockjs-client')
var url = 'http://localhost:8090/websocket/tracker';

var sock= new SockJS(url);


var callback = function(message){
    
    console.log('received message: '+message.body);
    var current = message.body;
    
    if(message.body == "/Program1"){
       
         console.log("startProgram1");
        request.get("http://192.168.1.101:8070/Program1",{},function(err,res,body){

        });
        
        
    }else if(message.body == "/Program2"){
          
         console.log("startProgram1");
        request.get("http://192.168.1.101:8070/Program2",{},function(err,res,body){

        });
        
        
    }else if(message.body == "/Program3"){
        
         console.log("startProgram1");
        request.get("http://192.168.1.101:8070/Program3",{},function(err,res,body){

        });
        
    }else if(message.body == "/shutdownAll"){
        
         console.log("shutdownAll");
        request.get("http://192.168.1.101:8070/shutdownAll",{},function(err,res,body){

        });
        
    }
};


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
    stompClient.subscribe('/topic/notification',callback);
   
});

app.listen(3000,function(){
    console.log('app listen on Port 3000');
});

/*
*************
************
******   OPCUA
*************
************
*/
// Let's create an instance of OPCUAServer
const server = new opcua.OPCUAServer({
    port: 4334, // the port of the listening socket of the server
    resourcePath: "UA/MyLittleServer", // this path will be added to the endpoint resource name
    buildInfo : {
    productName: "MySampleServer1",
    buildNumber: "7658",
    buildDate: new Date(2014,5,2)
}
    
});

function post_initialize() {
    console.log("initialized");
    function construct_my_address_space(server) {

        const addressSpace = server.engine.addressSpace;
        const namespace = addressSpace.getOwnNamespace();
       
        const device = namespace.addObject({
            organizedBy: addressSpace.rootFolder.objects,
            browseName: "MyDevice"
        });
       
        var variableRaspi1 = "0";
        var variableRaspi2 = "0";
        
        namespace.addVariable({
            componentOf: device,
            nodeId: "ns=1;b=1020FFAB", 
            browseName: "Raspi1",
            dataType: "String",
            value: {
                get: function () {
                    return new opcua.Variant({dataType: opcua.DataType.String,  value: variableRaspi1 });
                
                },
                
                set: function(val) {
                    variableRaspi1 = val.value;
                    console.log(val.value);
                    stompClient.send('/notification',{},val.value);
                    return opcua.StatusCodes.Good;
                }
            },
        });
        namespace.addVariable({
            componentOf: device,
            nodeId: "ns=1;b=1021FFAB",
            browseName: "Raspi2",
            dataType: "String",
            value: {
                get: function () {
                    return new opcua.Variant({dataType: opcua.DataType.String, value: variableRaspi2 });
                
                },
                
                set: function(val) {
                    variableRaspi2 = val.value;
                    
                    stompClient.send('/notification',{},val.value );
                    return opcua.StatusCodes.Good;
                }
            }
        });
        
        
           
    }
    construct_my_address_space(server);

    server.start(function() {
        console.log("Server is now listening ... ( press CTRL+C to stop)");
        console.log("port ", server.endpoints[0].port);

        const endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log(" the primary server endpoint url is ", endpointUrl );
    });
}

    /**
     * returns the percentage of free memory on the running machine
     * @return {double}
     */
   /* function available_memory() {
        // var value = process.memoryUsage().heapUsed / 1000000;
        const percentageMemUsed = os.freemem() / os.totalmem() * 100.0;
        return percentageMemUsed;
    }*/
server.initialize(post_initialize);

