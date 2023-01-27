function determineTime(newTimeStart, newTimeEnd, oldTimeStart, oldTimeEnd) {
    if (!this.checkValidTimestamp(newTimeStart) || !this.checkValidTimestamp(newTimeEnd) || !this.checkValidTimestamp(oldTimeStart)
        || !this.checkValidTimestamp(oldTimeEnd)) {
        throw "Invalid input time";

    }

    if (!this.checkStartEndValidation(newTimeStart, newTimeEnd) || !this.checkStartEndValidation(oldTimeStart, oldTimeEnd)) {
        throw "Start time must be earlier that end time";
    }


    return newTimeEnd < oldTimeStart || newTimeStart > oldTimeEnd;
}

function checkValidTimestamp(time) {
    return time.getTime() > 0;
}

function checkStartEndValidation(start, end) {
    return start < end;
}

module.exports={
    determineTime,
    checkValidTimestamp,
    checkStartEndValidation
}
