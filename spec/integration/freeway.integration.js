//requires zookeper running on localhost:9092 and kafka running locally
//it also requires host to be free on port 8083
var when = require('when'); //when for promises
var sinon = require('sinon');
var expect = require('chai').expect;
var eventHandler = require("../../eventHandler");
var eventBroker = require("../../eventBroker");
var freeway = require('../../freeway');

var zookeeper = 'localhost:9092';
var eventTopic = "freewayEventTest";
var localhostEventServer = "http://localhost:8083";
function unrecognizedHandler(event, data) {
    
}
//setup the eventServer
describe('Setup EventBroker server for kafka to talk to', function () {
    
     //setup producer to send events
    var sendEvent = eventBroker(zookeeper, eventTopic, null);
    
    it('sendEvent should exist', function (done) {
        expect(sendEvent).to.exist
        done();
    });
    
    //express boilerplate
    var express = require('express');
    var bodyParser = require('body-parser');
    app = express();
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    //Broadcast new events to all services
    function onEvent(event, data) {
        sendEvent(event, data);
    }
    //listen for new applications
    app.post('/', function(req, res) {
        eventHandler('localhost:9092', req.body.topic, {}, onEvent, __dirname + '/kafka-offsets', null);
        res.status(200).send('Acepting events');
    });
    
    app.listen(8083);
});

//test freeway.js
describe('Freeway integration test', function () {
    it('should send and then recive event', function (done) {
        this.timeout(50000); //set large time to allow for network requests to finish
        var eventMap = { //eventHandler
            add: function(event) {
                done();
            }
        };
        //use Freeway
        freeway(zookeeper, eventTopic, eventMap, unrecognizedHandler, null, "Freeway", localhostEventServer).then(function(sendEvent){
            //send event
            sendEvent("add", "test");
        }, null);
    });
});
