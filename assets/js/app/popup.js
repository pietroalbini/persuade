var OutsidePopup = {

    popup: null,

    init: function() {
        // Close the popup if the main window is closed
        window.addEventListener("beforeunload", function() {
            if (this.popup !== null) {
                this.popup.close();
            }
        }.bind(this));
    },

    open: function() {
        this.popup = window.open(location.href, document.title,
            'height=600,width=800'
        );
    },

    refresh: function() {
        if (this.popup !== null && this.popup.Popup !== undefined) {
            this.popup.Popup.refresh();
        }
    },

    on_close: function() {
        Pages.push("#closed-popup");
    },

    is_popup: function() {
        return false;
    },

};


var InsidePopup = {

    main: null,

    canvas_el: "#popup-current",
    prerender_previous_el: "#popup-prerender-previous canvas",
    prerender_next_el: "#popup-prerender-next canvas",

    init: function() {
        this.main = window.opener;

        // Go back when exiting from full screen
        document.addEventListener("fullscreenchange", function() {
            if (document.fullscreenElement === null) {
                Pages.back();
            } else {
                this.refresh();
            }
        }.bind(this));

        window.addEventListener("beforeunload", function() {
            this.main.Popup.on_close();
        }.bind(this));

        // Page up, left arrow, up arrow: previous slide
        Keyboard.bind(33, function() { this.main.Console.previous(true) }.bind(this));
        Keyboard.bind(37, function() { this.main.Console.previous(true); return true; }.bind(this));
        Keyboard.bind(38, function() { this.main.Console.previous(true); return true; }.bind(this));

        // Space bar, page down, right arrow, down arrow: next slide
        Keyboard.bind(32, function() { this.main.Console.next(true) }.bind(this));
        Keyboard.bind(34, function() { this.main.Console.next(true); return true; }.bind(this));
        Keyboard.bind(39, function() { this.main.Console.next(true); return true; }.bind(this));
        Keyboard.bind(40, function() { this.main.Console.next(true); return true; }.bind(this));

        // Load the PDF
        PDF.load(this.main.PDF.url, function() {
            Pages.replace("#popup-intro");
        }, function() {
            Pages.replace("#popup-error");
        });
    },

    refresh: function() {
        // Don't render if not in fullscreen
        if (document.fullscreenElement === null) {
            return;
        }

        var current = this.main.Console.current;
        var total = PDF.total_pages();

        PDF.render(this.main.Console.current, q(this.canvas_el));

        if (current !== 1) {
            PDF.render(current - 1, q(this.prerender_previous_el))
        }

        if (current < total) {
            PDF.render(current + 1, q(this.prerender_next_el));
        }
    },

    is_popup: function() {
        return true;
    },

}


// Use the correct thing for Popup
if (window.opener !== null) {
    window.Popup = InsidePopup;
} else {
    window.Popup = OutsidePopup;
}
