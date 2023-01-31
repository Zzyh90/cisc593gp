const utils = require("../common/utils")

describe("time conflict case 1", ()=>{
    it('determine time case 1', async () =>{
        const compare = utils.determineTime(new Date('2023-01-26T08:00:00'), new Date('2023-01-26T10:30:00'), new Date('2023-01-26T10:00:00'), new Date('2023-01-26T10:15:00'))
        expect(compare).toEqual(false)
    })
});

describe("time conflict case 2", ()=>{
    it('determine time case 2', async () =>{
        const compare = utils.determineTime(new Date('2023-01-26T08:00:00'), new Date('2023-01-26T08:30:00'), new Date('2023-01-26T10:00:00'), new Date('2023-01-26T10:30:00'))
        expect(compare).toEqual(true)
    })
})

describe("time conflict case 3", ()=>{
    it('validate timestamp case 1', async () =>{
        const compare = utils.checkValidTimestamp(new Date('2023-01-26T08:00:00'))
        expect(compare).toEqual(true)
    })
})

describe("time conflict case 4", ()=>{
    it('validate timestamp case 2', async () =>{
        const compare = utils.checkValidTimestamp("new Date('2023-01-26T08:00:00')")
        expect(compare).toEqual(false)
    })
})

describe("time conflict case 5", ()=>{
    it('validate start end time case 1', async () =>{
        const compare = utils.checkStartEndValidation(new Date('2023-01-26T08:00:00'), new Date('2023-01-26T08:30:00'))
        expect(compare).toEqual(true)
    })
})

describe("time conflict case 6", ()=>{
    it('validate start end time case 2', async () =>{
        const compare = utils.checkStartEndValidation(new Date('2023-01-26T09:00:00'), new Date('2023-01-26T08:30:00'))
        expect(compare).toEqual(false)
    })
})

describe("time conflict case 7", ()=>{
    it('validate start end time case 3', async () =>{
        const compare = utils.checkStartEndDifference(new Date('2023-01-26T08:00:00'), new Date('2023-01-26T08:30:00'))
        expect(compare).toEqual(true)
    })
})

describe("time conflict case 8", ()=>{
    it('validate start end time case 4', async () =>{
        const compare = utils.checkStartEndDifference(new Date('2023-01-26T08:00:00'), new Date('2023-01-27T08:30:00'))
        expect(compare).toEqual(false)
    })
})

describe("time conflict case 9", ()=>{
    it('validate start end time case 5', async () =>{
        const compare = utils.checkStartEndDifference(new Date('2023-01-26T08:00:00'), new Date('2023-01-27T07:30:00'))
        expect(compare).toEqual(false)
    })
})

describe("time conflict case 10", ()=>{
    it('validate start date case 1', async () =>{
        const compare = utils.checkStartWithin30Days(new Date('2023-02-02T08:00:00'))
        expect(compare).toEqual(true)
    })
})

describe("time conflict case 11", ()=>{
    it('validate start date case 2', async () =>{
        const compare = utils.checkStartWithin30Days(new Date('2023-05-02T08:00:00'))
        expect(compare).toEqual(false)
    })
})
