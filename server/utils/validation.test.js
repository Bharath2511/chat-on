const expect = require('expect')
//import isRealString
const {isRealString} = require('./validation')






describe('isRealString',()=>{
    it('should reject non-string values',()=>{
        var res = isRealString(98)
        expect(res).toBe(false)
    })
    it('should reject string with only spaces',()=>{
        var res = isRealString('    ')
        expect(res).toBe(false)
    })
    it('should allow string with non-space characters',()=>{
        var res = isRealString('  Bharath  ')
        expect(res).toBe(true)
    })
})
