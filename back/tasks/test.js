const utils = require("../common/utils")
async function main(){
    // console.log(utils.determineTime(new Date('2023-01-26T08:00:00'), new Date('2023-01-26T10:30:00'), new Date('2023-01-26T10:00:00'), new Date('2023-01-26T10:15:00')));
    // console.log(utils.determineTime(new Date('2023-01-26T08:00:00'), new Date('2023-01-26T07:30:00'), new Date('2023-01-26T10:00:00'), new Date('2023-01-26T10:30:00')));
    // console.log(utils.determineTime(new Date('2023-01-26T08:00:00'), new Date('2023-01-26T08:30:00'), new Date('2023-01-26T10:00:00'), new Date('2023-01-26T09:00:00')));
    // console.log(utils.determineTime(new Date('2023-01-26T08:00:00'), new Date('2023-01-26T08:30:00'), new Date('2023-01-26T10:00:00'), new Date('2023-01-26T10:30:00')));
    // console.log(utils.checkStartEndDifference(new Date('2023-01-26T08:00:00'), new Date('2023-01-26T08:30:00')))
    console.log(utils.checkStartWithin30Days(new Date('2023-01-02T08:00:00')))
}

main().catch((error) => {
    console.error(error);
});
