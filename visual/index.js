    var gauge, gauge2  ;
    var canvas,canvas2;
    var obj = null;
    var obj2 = null;
    var data      = [];
    var numvalues = 1200;

   $(function(){
        
        gauge = new RGraph.Gauge('cvs', 0, 15, 0)
                .set('scale.decimals', 0)
                .set('tickmarks.small', 50)
                .set('tickmarks.big', 5)
                .set('title.top', 'Current')
                .set('title.top.size', 24)
                .set('title.top.pos', 0.15)
                .set('title.bottom', 'mA')
                .set('title.bottom.color', '#aaa')
                .set('border.outer', 'Gradient(white:white:white:white:white:white:white:white:white:white:#aaa)')
                .draw();
        canvas = document.getElementById("cvs");
        gauge2 = new RGraph.Gauge('cvs2', 0, 15,0)
                .set('scale.decimals', 0)
                .set('tickmarks.small', 50)
                .set('tickmarks.big', 5)
                .set('title.top', 'Current')
                .set('title.top.size', 24)
                .set('title.top.pos', 0.15)
                .set('title.bottom', 'mA')
                .set('title.bottom.color', '#aaa')
                 .set('border.outer', 'Gradient(white:white:white:white:white:white:white:white:white:white:#aaa)')
                .draw();
       canvas2 = document.getElementById("cvs2");
        
    });
    
    
    var socket = io();

    socket.on('chatmessage', function(msg){
              
            var value = JSON.parse(msg);
        console.log(value);
            
        if(value.id == "Motor1"){
            
            RGraph.Clear(canvas);
            if(value.currentmA <= 0){
                value.currentmA = 0;
                  $("#alert1").removeClass("alert alert-success");
                $("#alert1").addClass("alert alert-danger")
            }else{
                  $("#alert1").removeClass("alert alert-danger")
                $("#alert1").addClass("alert alert-success");
                
            }
                
           gauge.value = value.currentmA;
            gauge.draw();
            
        }else{
            RGraph.Clear(canvas2);
            if(value.currentmA <= 0){
                value.currentmA = 0;
                $("#alert2").removeClass("alert alert-success");
                $("#alert2").addClass("alert alert-danger")
            }else{
                $("#alert2").removeClass("alert alert-danger")
                $("#alert2").addClass("alert alert-success");
                
               
            }
            
            gauge2.value = value.currentmA;
            gauge2.draw();
           
        }
             
        });
    socket.on('error', function(e){
        console.log(e);
    });
   function disconnect() {
       if (stompClient !== null) {
            socket.disconnect();
        }
       
       console.log("Disconnected");
   }   
    
    