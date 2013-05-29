/*
 * CountDownTimer
 * by James G. Lombardo, dba The ByteShop.Net
 * Version 1.00
 * 
 * Copyright 2013 by The ByteShop.Net
 * License: MIT License
 *
 * The MIT License is simple and easy to understand and it places almost no 
 * restrictions on what you can do with a CountDownTimer software. You are free
 * to use this software in any projects as long as this header is left intact.
 *
 * The ByteShop.Net DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE, 
 * INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS[,][.] IN NO 
 * EVENT SHALL The BytesShop.Net BE LIABLE FOR ANY SPECIAL, INDIRECT OR 
 * CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, 
 * DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER 
 * TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE 
 * OR PERFORMANCE OF THIS SOFTWARE.
 */

// create the root namespace and making sure we're not overwriting it
var net = net || {};

// create a general purpose namespace method
// this will allow us to create namespace a bit easier
net.createNS = function(namespace) {
    var nsparts = namespace.split(".");
    var parent = net;

    // we want to be able to include or exclude the root namespace 
    // So we strip it if it's in the namespace
    if (nsparts[0] === "net") {
        nsparts = nsparts.slice(1);
    }

    // loop through the parts and create 
    // a nested namespace if necessary
    for (var i = 0; i < nsparts.length; i++) {
        var partname = nsparts[i];
        // check if the current parent already has 
        // the namespace declared, if not create it
        if (typeof parent[partname] === "undefined") {
            parent[partname] = {};
        }
        // get a reference to the deepest element 
        // in the hierarchy so far
        parent = parent[partname];
    }
    // the parent is now completely constructed 
    // with empty namespaces and can be used.
    return parent;
};

net.createNS('net.byteshop.util.time');

/**
 * CountDownTimer is a class that provides a dynamic count down display
 * from a starting time to zero.
 *
 * Example of how to use:
 * 
 * 	@example
 *	var startTimeInSeconds = 20000;
 *	var displayElement = document.getElementById("myDisplayElement");
 *	var displayFormat = 'MEDIUM';
 * 	var myCounter = new net.byteshop.util.time.CountDownTimer();
 *	myCounter.start(startTimeInSeconds,displayElement,displayFormat);
 *
 * Display format options:
 *
 *	@example
 * 	An example of the MEDIUM (default) display format is: 2d 3h 40m 23s
 *	@example
 * 	An example of the LONG display format is: 
 *                  2 days 3 hours 40 minutes 23 seconds
 *	@example
 * 	An example of the SHORT display format is: 02:03:40:23
 */
net.byteshop.util.time.CountDownTimer = function() {
    var timeToGo = "";
    var startValue = "";
    var countDownTimer = "";
    var format = "MEDIUM";

    /**
     * Starts the count down timer. The timer will automatically be
     * stopped when the count down gets to zero.
     * @param {Number} [startTime] the start time in seconds
     * @param {Object} [timeToGoElement] the HTML element where the display 
     * text is set to the innerHTML of this element
     */
    var start = function(startTime, timeToGoElement, displayFormat) {
        startValue = startTime;
        timeToGo = timeToGoElement;
        format = displayFormat;
        countDownTimer = window.setInterval(countDown, 1000);
    };

    var stop = function() {
        window.clearInterval(countDownTimer);
    };

    var countDown = function() {
        if (startValue > 0) {
            startValue--;
            timeToGo.innerHTML = formatValue(startValue);
        } else {
            // if <= 0 the count down has ended
            timeToGo.innerHTML = formatValue(startValue);
        }
    };

    var formatValue = function(timeValue) {
        var fmt, days, hrs, mins, secs;
        var DAY_SEC = 60 * 60 * 24;
        var HR_SEC = 60 * 60;
        var MIN_SEC = 60;

        if (timeValue <= 0) {
            stop();
            return "Ended";
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

        // now prepare format and return
        switch (format) {
            case "MEDIUM":
                fmt = "" + days + "d " + hrs + "h " + mins + "m " + secs + "s";
                break;

            case "LONG":
                if (days == 1) {
                    days = days + " day ";
                } else {
                    days = days + " days ";
                }
                if (hrs == 1) {
                    hrs = hrs + " hour ";
                } else {
                    hrs = hrs + " hours ";
                }
                if (days == 1) {
                    mins = mins + " minute ";
                } else {
                    mins = mins + " minutes ";
                }
                if (secs == 1) {
                    secs = secs + " second";
                } else {
                    secs = secs + " seconds";
                }
                fmt = "" + days + hrs + mins + secs;
                break;

            case "SHORT":
                if (days < 10)
                    days = "0" + days;
                if (hrs < 10)
                    hrs = "0" + hrs;
                if (mins < 10)
                    mins = "0" + mins;
                if (secs < 10)
                    secs = "0" + secs;
                fmt = "" + days + ":" + hrs + ":" + mins + ":" + secs;
                break;

            default:
                fmt = "" + days + "d " + hrs + "h " + mins + "m " + secs + "s";
        }

        return fmt;
    };

    return {
        // Most properties and functions are private, but we'll expose this one.
        start: start
    };
};