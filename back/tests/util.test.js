const utils = require("../common/utils")

describe("time conflict case 1", ()=>{
    it('determine time case 1', async () =>{
        compare = utils.determineTime(new Date('2023-01-26T08:00:00'), new Date('2023-01-26T10:30:00'), new Date('2023-01-26T10:00:00'), new Date('2023-01-26T10:15:00'))
        expect(compare).toEqual(false)
    })

});

describe("time conflict case 2", ()=>{
    it('determine time case 2', async () =>{
        compare = utils.determineTime(new Date('2023-01-26T08:00:00'), new Date('2023-01-26T08:30:00'), new Date('2023-01-26T10:00:00'), new Date('2023-01-26T10:30:00'))
        expect(compare).toEqual(true)
    })

})