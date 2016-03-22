//libaries
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var expect = require('chai').expect;

//stubs
function sendStub(topic, partion, data) {
    
}

function producerStub(options) {
    return {
        send : sendStub
    };
}
var kafkaStub  = {
    Producer: producerStub
};


describe('EventBroker', function () {
    it('should call producerStub', function (done) {
        var spy = sinon.spy(producerStub);
        var eventBroker = proxyquire("../../eventBroker", {
            'kafka-native': kafkaStub
        });
        var sendEvent = eventBroker("localhost:9092", "test", null);
        expect(spy.calledWith({
            broker: "localhost:9092"
        }).calledOnce);
        done();
    });
    
    it('should call sendStub', function (done) {
        var spy = sinon.spy(sendStub);
        var eventBroker = proxyquire("../../eventBroker", {
            'kafka-native': kafkaStub
        });
        var sendEvent = eventBroker("localhost:9092", "test", null);
        var eventData = {
            data: "testData"
        };
        var eventName = "testEvent";
        sendEvent(eventName, eventData);
        expect(spy.calledWith("test", 0, [
            JSON.stringify({
                event: eventName,
                data: eventData
            })
        ]).calledOnce);
        done();
    });
    
});
