var expect = require('expect');
var {generateMessage,generateLocationMessage}  = require('./message');

describe('generateMessage', () => {
   it('should generate correct message object', () => {

       var from = 'sai kumar';
       var text = 'chill bro';
       var message = generateMessage(from, text);

       expect(typeof message.createdAt).toBe('number');
       expect(message).toMatchObject({from, text});
   });

});

describe('generateLocalMessage',()=>{
    it('should generate correct location object',()=>{
        var from= "santosh"
        var latitude =15
        var longitude=19
        var url = 'https://www.google.com/maps?q=15,19'
        var message = generateLocationMessage(from,latitude,longitude)

        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({from, url});
   
    })
})