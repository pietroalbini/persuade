window.Timer = {

    count: 0,
    started: false,

    content_el: "#timer",
    toggle_el: "#toggle-timer",
    stop_el: "#reset-timer",
    toggle_icon_el: "#toggle-timer i",

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
        var hours = Math.floor(this.count / (60 * 60));
        var minutes = Math.floor(this.count / 60);
        var seconds = this.count % 60;

        var msg = hours + ":" +
                  (minutes < 10 ? "0"+minutes : minutes) + ":" +
                  (seconds < 10 ? "0"+seconds : seconds);

        q(this.content_el).innerHTML = msg;
    },

    set_status: function(started) {
        this.started = started;

        if (this.started === true) {
            q(this.toggle_icon_el).classList.remove("fa-play");
            q(this.toggle_icon_el).classList.add("fa-pause");
        } else {
            q(this.toggle_icon_el).classList.remove("fa-pause");
            q(this.toggle_icon_el).classList.add("fa-play");
        }
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
