//libaries
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var expect = require('chai').expect;

//stubs
function startStub() {}
var eventData = {
    data: "testData"
 };
function consumerStub(options) {
    options.receive_callback({
        messages: [{
            payload: JSON.stringify({
                event: "testEvent",
                data: eventData
            })
        }]
    });
    return {
        start: startStub    
    };
}
var kafkaStub  = {
    Consumer: consumerStub
};
var eventMap = {
    testEvent : function(data) {
        
    }
};


describe('EventHandler', function () {
    
    
    it('should call consumerStub', function (done) {
        var spy = sinon.spy(consumerStub);
        var eventHandler = proxyquire("../../eventHandler", {
            'kafka-native': kafkaStub
        });
        eventHandler("localhost:9092", "test", {}, function (ar1,arg2) {}, "./", null);
        expect(spy.calledWith({
            broker: "localhost:9092",
            topic: "test",
            offset_directory: "./"
        }).calledOnce);
        done();
    });
    
    it('should call startStub', function (done) {
        var spy = sinon.spy(startStub);
        var eventHandler = proxyquire("../../eventHandler", {
            'kafka-native': kafkaStub
        });
        eventHandler("localhost:9092", "test", {}, function (ar1,arg2) {}, "./", null);
        expect(spy.calledWith().calledOnce);
        done();
    });
    
    it('should call eventMap.testEvent', function (done) {
        var spy = sinon.spy(eventMap.testEvent);
        var eventHandler = proxyquire("../../eventHandler", {
            'kafka-native': kafkaStub
        });
        eventHandler("localhost:9092", "test", {}, function (ar1,arg2) {}, "./", null);
        expect(spy.calledWith(eventData).calledOnce);
        done();
    });
    
    
});


