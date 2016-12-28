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
    slideshow_page_el: "#popup-slideshow",
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
        Keyboard.bind(["#popup-slideshow"], [33, 37, 38], function() {
            this.main.Console.previous(true);
            return true;
        }.bind(this));

        // Space bar, page down, right arrow, down arrow: next slide
        Keyboard.bind(["#popup-slideshow"], [32, 34, 39, 40], function() {
            this.main.Console.next(true);
            return true;
        }.bind(this));

        // F5: toggle fullscreen
        Keyboard.bind(["#popup-slideshow", "#popup-intro"], [116], function() {
            this.toggle_fullscreen();
            return true;
        }.bind(this));

        // Dot and B: black/unblack the screen
        Keyboard.bind(["#popup-slideshow"], [66, 190], function() {
            q(this.slideshow_page_el).classList.remove("white");
            q(this.canvas_el).classList.toggle("black");
            return true;
        }.bind(this));

        // Comma and W: white/unwhite the screen
        Keyboard.bind(["#popup-slideshow"], [87, 188], function() {
            q(this.canvas_el).classList.remove("black");
            q(this.slideshow_page_el).classList.toggle("white");
            return true;
        }.bind(this));

        // Load the PDF
        PDF.load(this.main.PDF.data, function() {
            Pages.replace("#popup-intro");
        }, function() {
            Pages.replace("#popup-error");
        });

        Pages.on_show("#popup-slideshow", function() {
            document.documentElement.requestFullscreen();
        }.bind(this));
    },

    toggle_fullscreen: function() {
        if (document.fullscreenElement === null) {
            // Remove black/white mode
            q(this.canvas_el).classList.remove("black");
            q(this.slideshow_page_el).classList.remove("white");

            Pages.push("#popup-slideshow");
        } else {
            document.exitFullscreen();
        }
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
