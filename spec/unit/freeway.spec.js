//stubs
function sendEvent(event, data) {}
function eventBrokerStub(broker, topic, log) {return sendEvent;}
function eventHandlerStub (broker, topic, events, unrecognizedEventHandler, offset_directory, log) {}
function resquestStub(options, callback) {return Promise.resolve("Accepting Requests");}
//libaries
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var expect = require('chai').expect;

//test freeway.js
describe('Freeway', function () {
    //test to see if eventHandler.js is being called once
    it('should call eventHandler', function (done) {
        var spy = sinon.spy(eventHandlerStub);
        var freeway = proxyquire('../../freeway',{
            "./eventBroker" : eventBrokerStub,
            "./eventHandler" : eventHandlerStub,
            'request-promise' : resquestStub
        });
        freeway("localhost:9029", "Test", {}, function(arg,arg2) {}, null, "test1", "localhost:8080").then(function(sendEvent){
            expect(spy.calledOnce);
            done();      
        });
        
    });
    
    //test to see if request is being called once
    it('should call the out to request', function (done) {
        var spy = sinon.spy(resquestStub);
        var freeway = proxyquire('../../freeway',{
            "./eventBroker" : eventBrokerStub,
            "./eventHandler" : eventHandlerStub,
            'request-promise' : resquestStub
        });
        freeway("localhost:9029", "Test", {}, function(arg,arg2) {}, null, "test1", "localhost:8080").then(function(sendEvent){
            expect(spy.calledOnce);
            done();      
        });
    });
    
    //test to see if eventBroker.js is being called once
    it('should call eventBroker', function (done) {
        var spy = sinon.spy(eventBrokerStub);
        var freeway = proxyquire('../../freeway',{
            "./eventBroker" : eventBrokerStub,
            "./eventHandler" : eventHandlerStub,
            'request-promise' : resquestStub
        });
        freeway("localhost:9029", "Test", {}, function(arg,arg2) {}, null, "test1", "localhost:8080").then(function(sendEvent){
            expect(spy.calledOnce);
            done();      
        });
    });
   
   //test to see if sendEvent is called after being returned from eventBroker.js in freeway.js
   it('should call the sendEvent function', function (done) {
        var spy = sinon.spy(sendEvent);
        var freeway = proxyquire('../../freeway',{
            "./eventBroker" : eventBrokerStub,
            "./eventHandler" : eventHandlerStub,
            'request-promise' : resquestStub
        });
        freeway("localhost:9029", "Test", {}, function(arg,arg2) {}, null, "test1", "localhost:8080").then(function(sendEvent){
            sendEvent("test", "data");
            expect(spy.calledOnce);
            done();      
        });
   });
   
});
