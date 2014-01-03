/*
 * CountDownTimer
 * by James G. Lombardo, dba The ByteShop.Net, jlombardo@wi.rr.com
 * Version 1.01
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
var ByteShopJs = ByteShopJs || {};

/* Create a general purpose namespace method
 * to allow us to create namespace a bit easier
 * 
 * Aknowledgements: thanks to Kenneth Truyers 
 * (@link http://www.kenneth-truyers.net/about-kenneth-truyers/) for this
 * sweet function
 */
ByteShopJs.createNS = function (namespace) {
    var nsparts = namespace.split(".");
    var parent = ByteShopJs;

    // we want to be able to include or exclude the root namespace 
    // So we strip it if it's in the namespace
    if (nsparts[0] === "ByteShopJs") {
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

ByteShopJs.createNS('ByteShopJs.util.datetime');

/**
 * CountDownTimer is a class that provides a dynamic count down display
 * from a starting time or ending date to zero.
 *
 * Example of how to use:
 * 
 *      var endDateInSecondsToGo = 20000;
 *      var displayElement = document.getElementById("myDisplayElement");
 *      var displayFormat = 'MEDIUM';
 *      var myCounter = new ByteShopJs.util.datetime.CountDownTimer();
 *      myCounter.startUsingSecondsToEndDate(endDateInSecondsToGo,displayElement,displayFormat);
 *    
 *      // Alternatively you can use the startUsingEndDate() function,
 *      // passing a Date object or formatted date string for the end date param
 * 
 *      var endDate = new Date(2013,7,1,0,0,0,0);
 *      var displayElement = document.getElementById("myDisplayElement");
 *      var displayFormat = 'SHORT';
 *      var myCounter = new ByteShopJs.util.datetime.CountDownTimer();
 *      myCounter.startUsingEndDate(endDate,displayElement,displayFormat);
 *
 * Display format options: this script will auto-format when choice is SHORT,
 * MEDIUM or LONG. Choice of NONE provides data only:
 *
 *    - An example of the MEDIUM (default) display format is: 2d 3h 40m 23s
 *    - An example of the LONG display format is: 
 *      2 days 3 hours 40 minutes 23 seconds
 *    - An example of the SHORT display format is: 02:03:40:23
 *    - The NONE option is meant for use by those who want to format the
 *      time to go data on their own. For example you could put the digit
 *      values in colored boxes with a footer describing
 *      those digits. Note you need to use the sample stylesheet (main.css)
 *      or one of your own.
 */
ByteShopJs.util.datetime.CountDownTimer = function() {
    var timeToGo;
    var startValue;
    var countDownTimer;
    var format;
    var fmt, days, hrs, mins, secs;

    /**
     * Starts the count down timer. The timer will automatically be
     * stopped when the count down gets to zero.
     * @param {Date} endDate the end date for the counter
     * @param {Object} timeToGoElement the HTML element where the display 
     * text is set to the innerHTML of this element
     * @param {String} displayFormat a value of LONG, MEDIUM, SHORT or NONE
     * indicating the display format style. Default is MEDIUM.
     */
    var startUsingEndDate = function(endDate, timeToGoElement, displayFormat) {
        var today = new Date();
        startValue = Math.ceil((endDate - today)/1000)
        timeToGo = timeToGoElement;
        // default if missing
        format = !displayFormat ? "MEDIUM" : displayFormat;
        countDownTimer = window.setInterval(countDown, 1000);
    };

    /**
     * Starts the count down timer. The timer will automatically be
     * stopped when the count down gets to zero.
     * @param {Number} secondsToEndDate the number of seconds between now
     * and the end date
     * @param {Object} timeToGoElement the HTML element where the display 
     * text is set to the innerHTML of this element
     * @param {String} displayFormat a value of LONG, MEDIUM, SHORT or NONE 
     * indicating the display format style. Default is MEDIUM.
     */
    var startUsingSecondsToEndDate = function(secondsToEndDate, timeToGoElement, displayFormat) {
        startValue = secondsToEndDate;
        timeToGo = timeToGoElement;
        // default if missing
        format = !displayFormat ? "MEDIUM" : displayFormat;
        countDownTimer = window.setInterval(countDown, 1000);
    };

    var stop = function() {
        window.clearInterval(countDownTimer);
    };

    var countDown = function() {
        if (startValue > 0) {
            startValue--;
            if(format === "NONE") {
                formatValue(startValue);
                document.getElementById("days").innerHTML = days;
                document.getElementById("hours").innerHTML = hrs;
                document.getElementById("mins").innerHTML = mins;
                document.getElementById("secs").innerHTML = secs;
            } else {
                timeToGo.innerHTML = formatValue(startValue);
            }
        } else {
            // if <= 0 the count down has ended
            timeToGo.innerHTML = formatValue(startValue);
        }
    };

    var formatValue = function(timeValue) {
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
            // EXAMPLE: 12:22:13:11
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

            //EXAMPLE: 12d 22h 13m 11s
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
                
            case "NONE":
                fmt = "";
                break;           

            default:
                // SHORT format
                fmt = "" + days + "d " + hrs + "h " + mins + "m " + secs + "s";
        }

        return fmt;
    };

    return {
        // Most properties and functions are private, but we'll expose this one.
        startUsingEndDate: startUsingEndDate,
        startUsingSecondsToEndDate: startUsingSecondsToEndDate
    };
    
};