const utils = require("../common/utils")

describe("time validator tests", ()=>{
/* ---------------------------------------------------------------------------------------------------------------------------------- 
     Test Case Checking time validation with overlapped time periods
     Inputs: 
            time1: 2023-01-26T08:00:00 to 2023-01-26T10:30:00
            time2: 2023-01-26T10:00:00 to 2023-01-26T10:15:00
     Expected output: false(Not valid)
     Actual output: false
----------------------------------------------------------------------------------------------------------------------------------*/
    it('Checking time validation with overlapped time periods', async () =>{
        const compare = utils.determineTime(new Date('2023-01-26T08:00:00'), new Date('2023-01-26T10:30:00'), new Date('2023-01-26T10:00:00'), new Date('2023-01-26T10:15:00'))
        expect(compare).toEqual(false)
    })
/* ----------------------------------------------------------------------------------------------------------------------------------
     Test Case Checking time validation with valid time periods
     Inputs: 
            time1: 2023-01-26T08:00:00 to 2023-01-26T08:30:00
            time2: 2023-01-26T10:00:00 to 2023-01-26T10:30:00
     Expected output: true(Not valid)
     Actual output: true    
----------------------------------------------------------------------------------------------------------------------------------*/
    it('Checking time validation with valid time periods', async () =>{
        const compare = utils.determineTime(new Date('2023-01-26T08:00:00'), new Date('2023-01-26T08:30:00'), new Date('2023-01-26T10:00:00'), new Date('2023-01-26T10:30:00'))
        expect(compare).toEqual(true)
    })
/* ----------------------------------------------------------------------------------------------------------------------------------
     Test Case Checking time validation with valid time periods
     Inputs: 
            time1String: 2023-01-26T08:00:00
     Expected output: true(Valid)
     Actual output: true    
----------------------------------------------------------------------------------------------------------------------------------*/
    it('Checking input time validation with valid timestamp', async () =>{
        const compare = utils.checkValidTimestamp(new Date('2023-01-26T08:00:00'))
        expect(compare).toEqual(true)
    })
/* ----------------------------------------------------------------------------------------------------------------------------------
     Test Case Checking input time validation with string
     Inputs: 
            String: "new Date('2023-01-26T08:00:00')"
     Expected output: false(Not valid)
     Actual output: false      
----------------------------------------------------------------------------------------------------------------------------------*/
    it('Checking input time validation with string', async () =>{
        const compare = utils.checkValidTimestamp("new Date('2023-01-26T08:00:00')")
        expect(compare).toEqual(false)
    })
/* ----------------------------------------------------------------------------------------------------------------------------------
     Test Case Checking start and end time validation with valid times
     Inputs: 
            time1: '2023-01-26T08:00:00'
            time2: '2023-01-26T08:30:00'
     Expected output: true(Valid)
     Actual output: true    
----------------------------------------------------------------------------------------------------------------------------------*/
    it('Checking start and end time validation with valid times', async () =>{
        const compare = utils.checkStartEndValidation(new Date('2023-01-26T08:00:00'), new Date('2023-01-26T08:30:00'))
        expect(compare).toEqual(true)
    })
/* ----------------------------------------------------------------------------------------------------------------------------------
     Test Case Checking start and end time validation with later start time and earlier end time
     Inputs: 
            time1: '2023-01-26T09:00:00'
            time2: '2023-01-26T08:30:00'
     Expected output: false(Not valid)
     Actual output: false    
----------------------------------------------------------------------------------------------------------------------------------*/
    it('Checking start and end time validation with later start time and earlier end time', async () =>{
        const compare = utils.checkStartEndValidation(new Date('2023-01-26T09:00:00'), new Date('2023-01-26T08:30:00'))
        expect(compare).toEqual(false)
    })
/* ----------------------------------------------------------------------------------------------------------------------------------
     Test Case Checking if the time difference is within one day using timestamps from the same day
     Inputs: 
            time1: '2023-01-26T08:00:00'
            time2: '2023-01-26T08:30:00'
     Expected output: true(Valid)
     Actual output: true    
----------------------------------------------------------------------------------------------------------------------------------*/
    it('Checking if the time difference is within one day using timestamps from the same day', async () =>{
        const compare = utils.checkStartEndDifference(new Date('2023-01-26T08:00:00'), new Date('2023-01-26T08:30:00'))
        expect(compare).toEqual(true)
    })
/* ----------------------------------------------------------------------------------------------------------------------------------
     Test Case Checking if the time difference is within one day using timestamps from different days
     Inputs: 
            time1: '2023-01-26T08:00:00'
            time2: '2023-01-27T08:30:00'
     Expected output: false(Not valid)
     Actual output: false      
----------------------------------------------------------------------------------------------------------------------------------*/
    it('Checking if the time difference is within one day using timestamps from different days', async () =>{
        const compare = utils.checkStartEndDifference(new Date('2023-01-26T08:00:00'), new Date('2023-01-27T08:30:00'))
        expect(compare).toEqual(false)
    })
/* ----------------------------------------------------------------------------------------------------------------------------------
     Test Case Checking if the time difference is within one day using timestamps from different days but within 24 hours
     Inputs: 
            time1: '2023-01-26T08:00:00'
            time2: '2023-01-27T07:30:00'
     Expected output: false(Not valid)
     Actual output: false     
----------------------------------------------------------------------------------------------------------------------------------*/
    it('Checking if the time difference is within one day using timestamps from different days but within 24 hours', async () =>{
        const compare = utils.checkStartEndDifference(new Date('2023-01-26T08:00:00'), new Date('2023-01-27T07:30:00'))
        expect(compare).toEqual(false)
    })
/* ----------------------------------------------------------------------------------------------------------------------------------
     Test Case Checking if start date is within 30days from today using the date within 30 days
     Inputs: 
            time1: '2023-02-18T08:00:00'
     Expected output: true(Valid)
     Actual output: true      
----------------------------------------------------------------------------------------------------------------------------------*/
    it('Checking if start date is within 30days from today using the date within 30 days', async () =>{
        const compare = utils.checkStartWithin30Days(new Date('2023-03-05T08:00:00'))
        expect(compare).toEqual(true)
    })
/* ----------------------------------------------------------------------------------------------------------------------------------
     Test Case Checking if start date is within 30days from today using the date more than 30 days
     Inputs: 
            time1: '2023-05-02T08:00:00'
     Expected output: false(Not valid)
     Actual output: false         
----------------------------------------------------------------------------------------------------------------------------------*/
    it('Checking if start date is within 30days from today using the date more than 30 days', async () =>{
        const compare = utils.checkStartWithin30Days(new Date('2023-05-02T08:00:00'))
        expect(compare).toEqual(false)
    })
});
