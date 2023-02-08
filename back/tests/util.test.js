const utils = require("../common/utils")

describe("time validator tests", ()=>{
    it('Checking time validation with overlapped time periods', async () =>{
        const compare = utils.determineTime(new Date('2023-01-26T08:00:00'), new Date('2023-01-26T10:30:00'), new Date('2023-01-26T10:00:00'), new Date('2023-01-26T10:15:00'))
        expect(compare).toEqual(false)
    })

    it('Checking time validation with valid time periods', async () =>{
        const compare = utils.determineTime(new Date('2023-01-26T08:00:00'), new Date('2023-01-26T08:30:00'), new Date('2023-01-26T10:00:00'), new Date('2023-01-26T10:30:00'))
        expect(compare).toEqual(true)
    })

    it('Checking input time validation with valid timestamp', async () =>{
        const compare = utils.checkValidTimestamp(new Date('2023-01-26T08:00:00'))
        expect(compare).toEqual(true)
    })

    it('Checking input time validation with string', async () =>{
        const compare = utils.checkValidTimestamp("new Date('2023-01-26T08:00:00')")
        expect(compare).toEqual(false)
    })

    it('Checking start and end time validation with valid times', async () =>{
        const compare = utils.checkStartEndValidation(new Date('2023-01-26T08:00:00'), new Date('2023-01-26T08:30:00'))
        expect(compare).toEqual(true)
    })

    it('Checking start and end time validation with later start time and earlier end time', async () =>{
        const compare = utils.checkStartEndValidation(new Date('2023-01-26T09:00:00'), new Date('2023-01-26T08:30:00'))
        expect(compare).toEqual(false)
    })

    it('Checking if the time difference is within one day using timestamps from the same day', async () =>{
        const compare = utils.checkStartEndDifference(new Date('2023-01-26T08:00:00'), new Date('2023-01-26T08:30:00'))
        expect(compare).toEqual(true)
    })

    it('Checking if the time difference is within one day using timestamps from different days', async () =>{
        const compare = utils.checkStartEndDifference(new Date('2023-01-26T08:00:00'), new Date('2023-01-27T08:30:00'))
        expect(compare).toEqual(false)
    })

    it('Checking if the time difference is within one day using timestamps from different days but within 24 hours', async () =>{
        const compare = utils.checkStartEndDifference(new Date('2023-01-26T08:00:00'), new Date('2023-01-27T07:30:00'))
        expect(compare).toEqual(false)
    })

    it('Checking if start date is within 30days from today using the date within 30 days', async () =>{
        const compare = utils.checkStartWithin30Days(new Date('2023-02-18T08:00:00'))
        expect(compare).toEqual(true)
    })

    it('Checking if start date is within 30days from today using the date more than 30 days', async () =>{
        const compare = utils.checkStartWithin30Days(new Date('2023-05-02T08:00:00'))
        expect(compare).toEqual(false)
    })
});
