//requires zookeper running on localhost:9092 and kafka running locally
//it also requires host to be free on port 8096
var when = require('when'); //when for promises
var sinon = require('sinon');
var expect = require('chai').expect;
var eventHandler = require("../../eventHandler");
var eventBroker = require("../../eventBroker");
var freeway = require('../../freeway');

var zookeeper = 'localhost:9092';
var eventTopic = "test01";
var localhostEventServer = "http://localhost:8096";
function unrecognizedHandler(event, data) {
    
}
//setup event server
//describe('Setup EventBroker server for kafka to talk to', function () {
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
    //broadcast events to all services
    function onEvent(event, data) {
        sendEvent(event, data);
    }
    //listen for new requests
    app.post('/', function(req, res) {
        eventHandler('localhost:9092', req.body.topic, {}, onEvent, __dirname + '/kafka-offsets', null);
        res.status(200).send('Acepting events');
    });
    
    app.listen(8096);
//});
//use to check that multiplle instances of freeway are not interfering with one anothers comuncation and event recption
describe('Simulation of multiple clients talking to one event source server', function () {
    it('should send events from multiple instances and call handler appropriate number of times', function (done) {
        this.timeout(5000); //long timeout to account for network
        var numCalled = 0; //number of times addEvent has been called
        function addEvent(event) { //this method should be called 4 times total. Twice for each instance of freeway.
            numCalled++; //increment counter
            if (numCalled == 4) { //if 4 times call done.
                done();
            } else if (numCalled > 4) { //if more than for something is wrong
                done(); //call done a second time to fail test
                console.log("Called to many times " + numCalled); //log the number called
            }//if called to few times done will never be called and test will fail
        }
        //declare the event mapping
        var eventMap = {
            add: addEvent,
        };
        //create two differnt freeway instances and send a message from each
        freeway(zookeeper, eventTopic, eventMap, unrecognizedHandler, __dirname + "/StoreOffsetsInstance1", "Freeway_01", localhostEventServer).then(function(sendEvent) {
          sendEvent("add", "test_1"); 
        }, null);
        freeway(zookeeper, eventTopic, eventMap, unrecognizedHandler, __dirname + "/StoreOffsetsInstance1", "Freeway_02", localhostEventServer).then(function(sendEvent) {
          sendEvent("add", "test_2"); 
        }, null);
    });
});