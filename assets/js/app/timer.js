window.Timer = {

    count: 0,
    estimated: null,
    started: false,

    content_el: "#timer",
    toggle_el: "#toggle-timer",
    stop_el: "#reset-timer",

    init: function() {
        q(this.toggle_el).addEventListener("click", function(e) {
            e.preventDefault();
            this.toggle();
        }.bind(this));

        q(this.stop_el).addEventListener("click", function(e) {
            e.preventDefault();
            this.reset();
        }.bind(this));

        window.setInterval(function() {
            this.interval();
        }.bind(this), 1000);

        this.refresh();
    },

    refresh: function() {
        var count = this.count;
        if (this.estimated !== null) {
            count = this.estimated * 60 - count;
            if (count <= 0) {
                count = 0;
            }
        }

        var hours = Math.floor(count / (60 * 60));
        var minutes = Math.floor((count - hours * 60 * 60) / 60);
        var seconds = count % 60;

        var msg = hours + ":" +
                  (minutes < 10 ? "0"+minutes : minutes) + ":" +
                  (seconds < 10 ? "0"+seconds : seconds);

        q(this.content_el).innerHTML = msg;

        if (this.estimated !== null && count === 0 && this.started === true) {
            q(this.content_el).classList.toggle("out");
        } else {
            q(this.content_el).classList.remove("out");
        }
    },

    set_estimated: function(estimated) {
        this.estimated = estimated;
        this.refresh();
    },

    set_status: function(started) {
        this.started = started;

        if (this.started === true) {
            q(this.toggle_el).classList.remove("fa-play");
            q(this.toggle_el).classList.add("fa-pause");
        } else {
            q(this.toggle_el).classList.remove("fa-pause");
            q(this.toggle_el).classList.add("fa-play");
        }

        this.refresh();
    },

    toggle: function() {
        this.set_status(! this.started);
    },

    reset: function() {
        this.set_status(false);
        this.count = 0;
        this.refresh();
    },

    interval: function() {
        if (this.started === true) {
            this.count += 1;
            this.refresh();
        }
    },
};
