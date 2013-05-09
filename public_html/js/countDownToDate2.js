/* 
 * A simple JavaScript function to count down, with varying degrees
 * of precision, to a target date/time.
 * 
 * @author  Jim Lombardo, jlombardo@wctc.edu
 * @version 1.00
 */

var myTimer;            // the timer controlling the count down
var timeToGoElement;    // the element where the count down output goes
var startValue;         // the start value in seconds
var aggrevations;

function countDown() {
    if (startValue > 0) {
        startValue--;
        aggrevations = Math.floor(startValue / (60 * 30));
        timeToGoElement.innerHTML = formatValue(startValue) + 
                "<br/><br/>Aggrevations to go: " + aggrevations;
    } else {
        // if -1 or 0 the target date/time has been reached has ended
        timeToGoElement.innerHTML = formatValue(startValue);
    }
}

function formatValue(timeValue) {
    var fmt, days, hrs, mins, secs;
    var DAY_SEC = 60 * 60 * 24;
    var HR_SEC = 60 * 60;
    var MIN_SEC = 60;

    if (timeValue <= 0) {
        stopCountDown();
        return "Ended"; // change as needed
    }

//  get days to go
    days = Math.floor(timeValue / DAY_SEC);
    timeValue -= (days * DAY_SEC);

// get hours to go
    hrs = Math.floor(timeValue / HR_SEC);
    timeValue -= (hrs * HR_SEC);

// get minutes to go
    mins = Math.floor(timeValue / MIN_SEC);
    timeValue -= (mins * MIN_SEC);

// get seconds to go
    secs = timeValue;

// now prepare format and return, change as needed
    fmt = "" + days + "d " + hrs + "h " + mins + "m " + secs + "s";
    return fmt;
}

function startCountDown() {
    myTimer = window.setInterval("countDown()", 1000);
}

function stopCountDown() {
    window.clearInterval(myTimer);
}
