var expect = require('expect');

var{genaratemsg} = require('./message');

describe('generateMessage', () =>{
    it('should generate correct message object', () =>{
        var from='aki';
        var text='some message';
        var message = genaratemsg(from, text);
        expect(message.createAt).toBeA('number');
        expect(message).toInclude({from, text});
    });
});