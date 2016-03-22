//uses kafka for comuncation with an event sourcing server
var rp = require('request-promise'); //uses request with promises

//for examples of using this module check the integration test folder.

/**
 * Handles listing for events over Kafka.
 * param {string} zookeeper
 * The location of the zookeeper instance to run kafka
 * @param {string} topic
 * The topic recive new events from
 * @param object eventMap
 * An object where each property is a function that handles the property name event
 * @param {function} unrecognizedHandler
 * A function to which unrecognized events will be sent
 * @param {string} offsetdir
 * The directory where the offset will be stored. The file expected is <topic>-o.offset
 * @param {string} uniqueName
 * The name that will be used for the topic to send events that orginate here to the event server. MUST BE UNIQUE! non-unique
 * examples will result in duplicate events
 * @param {string} eventServer
 * the url of the eventServer to new events to.
 * @param {function} log
 * function that log data will be sent to.
 */
module.exports = function(zookeeper, topic, eventMap, unrecognizedHandler, offsetdir, uniqueName, eventServer, log) {
    
    function onError(err) { //error logging
        if (log) {log(error);}
        throw err;
    }
    
    if (!offsetdir) { //set directory to look for offesets 
        offsetdir = __dirname + '/kafka-offsets'; // if not specified default to ./kafka-offsets
    }
    //listen for events
    require("./eventHandler")(zookeeper, topic, eventMap, unrecognizedHandler,offsetdir, null);
    //send a request to the event server letting it know it know to listen for events that may orginate here
    
    return rp({
        url: eventServer,
        method: "POST",
        json: true,   
        body: {
            topic: uniqueName
        }
    }).then(function (parsedBody) {
        return require("./eventBroker")(zookeeper,uniqueName, null); //return the function to send events
    }).catch(function (err) {
        if(log){log(err);}
        return undefined;
    });
    
    
};