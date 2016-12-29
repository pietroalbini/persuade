/* Copyright (C) 2016  Pietro Albini <pietro@pietroalbini.org>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

window.Console = {

    current: -1,
    initialized: false,
    allow_black_white: false,

    sidebar_el: ".console-sidebar",
    slides_list_el: "#slides-list",
    slide_current_el: "#slide-current",
    slide_current_canvas: "#slide-current canvas",
    slide_next_el: "#slide-next canvas",
    slide_next_canvas: "#slide-next canvas",
    slide_arrow_el: "#slide-arrow",
    slide_preview_el: ".slide-preview",
    page_el: "#console",

    slide_preview_class: "slide-preview",
    active_slide_preview_class: "active",

    init: function(should_block_f5, allow_black_white) {
        // Don't initialize multiple times
        if (this.initialized === true) {
            return;
        }
        this.initialized = true;

        this.allow_black_white = allow_black_white;

        var slides = q(this.slides_list_el);

        // Remove all the slides from the list
        while (slides.firstChild) {
            slides.removeChild(slides.firstChild);
        }

        // Update the slides in the sidebar
        var new_slide, new_canvas;
        for (var page = 1; page <= PDF.total_pages(); page++) {
            new_slide = document.createElement("div");
            new_slide.setAttribute("data-page", page);
            new_slide.classList.add(this.slide_preview_class);

            new_canvas = document.createElement("canvas");
            new_slide.appendChild(new_canvas);

            slides.appendChild(new_slide);

            PDF.render(page, new_canvas);
        }

        // Switch page
        this.to(1);

        // Allow previews to be clicked
        qe(this.slide_preview_el, function(el) {
            el.addEventListener("click", function(e) {
                e.preventDefault();

                var to = parseInt(el.attributes["data-page"].value);
                this.to(to);
            }.bind(this));
        }.bind(this));

        // Page up, left arrow, up arrow: previous slide
        Keyboard.bind(["#console"], [33, 37, 38], function() {
            this.previous(true);
            return true;
        }.bind(this));

        // Space bar, page down, right arrow, down arrow: next slide
        Keyboard.bind(["#console"], [32, 34, 39, 40], function() {
            this.next(true);
            return true;
        }.bind(this));

        // Dot and B: black/unblack the screen
        Keyboard.bind(["#console"], [66, 190], function() {
            Popup.toggle_black();
            return true;
        }.bind(this));

        // Comma and W: white/unwhite the screen
        Keyboard.bind(["#console"], [87, 188], function() {
            Popup.toggle_white();
            return true;
        }.bind(this));

        if (should_block_f5) {
            Keyboard.bind(["#console"], [116], function() {
                return true;
            }.bind(this));
        }
    },

    render: function() {
        PDF.render(this.current, q(this.slide_current_canvas));

        if (this.current === PDF.total_pages()) {
            q(this.slide_arrow_el).classList.add("vis-hidden");
            q(this.slide_next_el).classList.add("vis-hidden");
        } else {
            q(this.slide_arrow_el).classList.remove("vis-hidden");
            q(this.slide_next_el).classList.remove("vis-hidden");

            PDF.render(this.current + 1, q(this.slide_next_canvas));
        }
    },

    to: function(to, center_preview) {
        // Don't render the same thing again
        if (to === this.current) {
            return;
        }

        // Don't overflow
        if (to < 1 || to > PDF.total_pages()) {
            return;
        }

        // Toggle the class in the sidebar
        var active;
        qe(this.slide_preview_el, function(el) {
            if (el.attributes["data-page"].value == to) {
                active = el;
                el.classList.add(this.active_slide_preview_class);
            } else {
                el.classList.remove(this.active_slide_preview_class);
            }
        }.bind(this));

        // Actually switch page
        this.current = to;
        this.render();
        Popup.refresh();

        // Move the scroll position
        if (center_preview === true) {
            var sidebar = q(this.sidebar_el);

            sidebar.scrollTop = (
                - sidebar.offsetHeight / 2
                + active.offsetTop
                + active.offsetHeight / 2
            );
        }
    },

    next: function(center_preview) {
        this.to(this.current + 1, center_preview);
    },

    previous: function(center_preview) {
        this.to(this.current - 1, center_preview);
    },

}
