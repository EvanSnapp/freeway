# freeway
This is a simple library for using Kafka to communicate to an event sourcing server.  
  
The module actually creates both a consumer and a producer. It creates a consumer on a user specified Kafka topic to look for new events being broadcast. The producer pushes events that were sourced from this application to the event server. The event server is notified of this new topic through a post request. Figuratively you could view these as two sides of the freeway, one for traffic to the server (I have had an event), and one for traffic from the server (have there been any events).  
  
freeway.js exports a function to setup the Kafka producer, Kafka consumer, and notify the server. The function returns a promise which on success resolves to a function that can be used to send events to the server.

##Example##


    var eventMap = {  
        event: function (eventData) {
            console.log(eventData);
        }
    }  
    function unrecognizedEvent(event, data) {
        console.log("unrecognized event " + event + "With data" + data);    
    }
    freeway("localhost:9029", "TestEvents", eventMap, unrecognizedEvent, null, "test1", "http://localhost:8086", null).then(function(sendEvent){  
        sendEvent("event", "EventData")  
        sendEvent("event, {  
            data: "This is JSON Data"  
        })     
    }, null);
    
In this example Kafka is using a zookeeper instance running on localhost:9029, and a consumer is listening on the topic TestEvents. The consumer will match the event name to a property on eventMap and call that function with the event's data. If there is not matching property on eventMap, unrecognizedEvent will be called with both the event and the data. The first null parameter tells freeway to use the default directory ("./kafka-offsets") for storing the current offsets of the topics. test1 is the topic of the channel from freeway to the server (**THIS SHOULD BE UNIQUE**). The second to last parameter is the url of the event sourcing server to notify. The final parameter is the logging parameter. This parameter is a function to which log data is output (console.log for example), but since it is null in this case nothing is outputed.  
  
The sendEvent function in the then clause allows for events to be sent to the event sourcing server. The first argument is the event, and the second argument is its data.