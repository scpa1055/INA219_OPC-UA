
/*global require,console,setTimeout */
var opcua = require("node-opcua");
var async = require("async");

var client = new opcua.OPCUAClient();
var endpointUrl = "opc.tcp://" + require("os").hostname() + ":4334/UA/MyLittleServer";

var the_session, the_subscription;

var test = {
    id: "Maschine1",
    timestamp: new Date(),
    value: Math.floor((Math.random() * 10) + 1),
    machineStatus: 1
}

var test1= JSON.stringify(test);

async.series([

    // step 1 : connect to
    function(callback)  {
        client.connect(endpointUrl,function (err) {
            if(err) {
                console.log(" cannot connect to endpoint :" , endpointUrl );
            } else {
                console.log("connected !");
            }
            callback(err);
        });
    },

    // step 2 : createSession
    function(callback) {
        client.createSession( function(err,session) {
            if(!err) {
                the_session = session;
            }
            callback(err);
        });
    },

    // step 3 : browse
    function(callback) {
       the_session.browse("RootFolder", function(err,browseResult){
           if(!err) {
               browseResult.references.forEach(function(reference) {
                   console.log( reference.browseName.toString());
                   
               });
           }
           callback(err);
       });
    },
 
    // step 4' : read a variable with read
    function(callback) {
        
        var nodesToWrite = [{
                nodeId: "ns=1;b=1020FFAB",
                attributeId: opcua.AttributeIds.Value,
                indexRange: null,
                value: { 
                    value: { 
                        dataType: opcua.DataType.String,
                         value: test1
                    }
              }
       }];
        console.log(test1);
      the_session.write(nodesToWrite, function(err,statusCode,diagnosticInfo) {
           if (!err) {
               console.log(" write ok" );
               
               console.log(statusCode);
           }
           callback(err);
       }); 
    },
],
function(err) {
    if (err) {
        console.log(" failure ",err);
    } else {
        console.log("done!");
    }
    client.disconnect(function(){});
}) ;

