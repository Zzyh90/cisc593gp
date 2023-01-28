function determineTime(newTimeStart, newTimeEnd, oldTimeStart, oldTimeEnd) {
    if (!this.checkValidTimestamp(newTimeStart) || !this.checkValidTimestamp(newTimeEnd) || !this.checkValidTimestamp(oldTimeStart)
        || !this.checkValidTimestamp(oldTimeEnd)) {
        throw "Invalid input time";
    }

    if (!this.checkStartEndValidation(newTimeStart, newTimeEnd) || !this.checkStartEndValidation(oldTimeStart, oldTimeEnd)) {
        throw "Start time must be earlier than end time";
    }

    return newTimeEnd < oldTimeStart || newTimeStart > oldTimeEnd;
}

function checkValidTimestamp(time) {
    try {
        return time.getTime() > 0;
    } catch (e) {
        return false;
    }
}

function checkStartEndValidation(start, end) {
    if (!this.checkValidTimestamp(start) || !this.checkValidTimestamp(end)) {
        throw "Invalid input time";
    }
    return start < end;
}

function checkStartEndDifference(start, end) {
    if (!this.checkValidTimestamp(start) || !this.checkValidTimestamp(end)) {
        throw "Invalid input time";
    }

    if (!this.checkStartEndValidation(start, end)) {
        throw "Start time must be earlier than end time";
    }

    return (end - start) / (1000 * 60 * 60 * 24) < 1 && end.getDate() - start.getDate() < 1;
}

function checkStartWithin30Days(start) {
    if (!this.checkValidTimestamp(start)) {
        throw "Invalid input time";
    }

    if (start.getTime() < Date.now()) {
        throw "Start time must be later than current time";
    }

    return (start.getTime() - Date.now()) / (1000 * 60 * 60 * 24) < 30;
}

module.exports={
    determineTime,
    checkValidTimestamp,
    checkStartEndValidation,
    checkStartEndDifference,
    checkStartWithin30Days
}
