var POPUP_HASH = "#popup";


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
        this.popup = window.open(
            location.href.split("#")[0] + POPUP_HASH, document.title,
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

        PDF.render(this.main.Console.current, q(this.canvas_el));
    },

    is_popup: function() {
        return true;
    },

}


// Use the correct thing for Popup
if (location.hash === POPUP_HASH) {
    window.Popup = InsidePopup;
} else {
    window.Popup = OutsidePopup;
}
