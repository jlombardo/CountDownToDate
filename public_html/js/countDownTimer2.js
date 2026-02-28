/*
 * Improved CountDownTimer
 * Version 2.0
 * by James G. Lombardo, dba The ByteShop.Net, jlombardo@wi.rr.com
 * License: MIT License
 */

class CountDownTimer {
    /**
     * @param {Object} config
     * @param {Date|string} [config.endDate]        - Target end date/time
     * @param {number}      [config.secondsToEnd]   - Seconds until end (alternative to endDate)
     * @param {Element}     [config.element]        - Container element for formatted output (not used with NONE format)
     * @param {Object}      [config.elements]       - Individual elements for NONE format: { days, hours, mins, secs }
     * @param {string}      [config.format]         - 'SHORT' | 'MEDIUM' | 'LONG' | 'NONE' (default: 'MEDIUM')
     * @param {Function}    [config.onTick]         - Called each tick with timeParts: { days, hours, minutes, seconds }
     * @param {Function}    [config.onComplete]     - Called when the countdown reaches zero
     */
    constructor({endDate = null, secondsToEnd = null, element = null, elements = null, format = 'MEDIUM', onTick = null, onComplete = null} = {}) {
        if (!endDate && !secondsToEnd) throw new Error('Either endDate or secondsToEnd must be specified');

        // Anchor to an absolute timestamp to prevent setInterval drift
        this.endTimestamp = secondsToEnd
            ? Date.now() + (secondsToEnd * 1000)
            : new Date(endDate).getTime();

        this.format = format.toUpperCase();
        this.onTick = onTick;
        this.onComplete = onComplete;
        this.timer = null;

        if (this.format === 'NONE') {
            // Accept explicit element references or fall back to default IDs
            this.noneElements = elements || {
                days:  document.getElementById('days'),
                hours: document.getElementById('hours'),
                mins:  document.getElementById('mins'),
                secs:  document.getElementById('secs')
            };
            if (!this.noneElements.days) throw new Error('NONE format requires elements with ids: days, hours, mins, secs');
        } else {
            if (!element) throw new Error('Element is required');
            this.element = element;
        }
    }

    start() {
        // Clear any existing interval to prevent leaks when called via resume()
        if (this.timer) clearInterval(this.timer);

        const tick = () => {
            // Recalculate from the real clock each tick — self-correcting against drift
            const remaining = Math.max(0, Math.ceil((this.endTimestamp - Date.now()) / 1000));

            if (remaining <= 0) {
                clearInterval(this.timer);
                this.timer = null;
                if (this.format === 'NONE') {
                    this.noneElements.days.innerHTML  = 0;
                    this.noneElements.hours.innerHTML = 0;
                    this.noneElements.mins.innerHTML  = 0;
                    this.noneElements.secs.innerHTML  = 0;
                } else {
                    this.element.innerHTML = 'Ended';
                }
                if (this.onComplete) this.onComplete();
                return;
            }

            const timeParts = CountDownTimer.calculateTimeParts(remaining);

            if (this.format === 'NONE') {
                this.noneElements.days.innerHTML  = timeParts.days;
                this.noneElements.hours.innerHTML = timeParts.hours;
                this.noneElements.mins.innerHTML  = timeParts.minutes;
                this.noneElements.secs.innerHTML  = timeParts.seconds;
            } else {
                this.element.innerHTML = CountDownTimer.formatTime(timeParts, this.format);
            }

            if (this.onTick) this.onTick(timeParts);
        };

        tick();
        this.timer = setInterval(tick, 1000);
    }

    stop() {
        clearInterval(this.timer);
        this.timer = null;
    }

    pause() {
        clearInterval(this.timer);
        this.timer = null;
    }

    resume() {
        if (!this.timer) this.start();
    }

    static calculateTimeParts(seconds) {
        const days = Math.floor(seconds / 86400);
        seconds -= days * 86400;
        const hours = Math.floor(seconds / 3600);
        seconds -= hours * 3600;
        const minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;

        return { days, hours, minutes, seconds };
    }

    static formatTime({ days, hours, minutes, seconds }, format) {
        switch (format) {
            case 'SHORT':
                return `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            case 'MEDIUM':
                return `${days}d ${hours}h ${minutes}m ${seconds}s`;
            case 'LONG':
                return `${days} ${days === 1 ? 'day' : 'days'} ${hours} ${hours === 1 ? 'hour' : 'hours'} ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
            default:
                return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    }
}
