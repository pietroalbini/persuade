window.Console = {

    current: -1,

    slides_list_el: "#slides-list",
    current_slide_el: "#slide-current canvas",
    next_slide_el: "#slide-next canvas",
    slide_preview_el: ".slide-preview",

    slide_preview_class: "slide-preview",

    init: function() {
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
    },

    render: function() {
        PDF.render(this.current, q(this.current_slide_el));
        PDF.render(this.current + 1, q(this.next_slide_el));
    },

    to: function(to) {
        // Don't render the same thing again
        if (to === this.current) {
            return;
        }

        // Don't overflow
        if (to < 1 || to > PDF.total_pages()) {
            return;
        }

        // Toggle the class in the sidebar
        qe(this.slide_preview_el, function(el) {
            if (el.attributes["data-page"].value == to) {
                el.classList.add("active");
            } else {
                el.classList.remove("active");
            }
        });

        // Actually switch page
        this.current = to;
        this.render();
    },
}
