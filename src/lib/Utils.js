function leadingZeroes(string, length) {
    return String(string).padStart(length, "0");
}

function formatDuration(duration) {
    return leadingZeroes(duration.hours(), 2) + ":" + leadingZeroes(duration.minutes(), 2) + ":" + leadingZeroes(duration.seconds(), 2);
}

export {
    leadingZeroes,
    formatDuration
}