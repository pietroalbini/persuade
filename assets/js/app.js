// Get slides URL from the intro page
q("#pdf-url-form").addEventListener("submit", function(e) {
    e.preventDefault();
    load_url(q("#pdf-url").value);
});


// Load an URL
function load_url(url) {
    Pages.push("#loading");

    PDF.load(url, function() {
        render_deck();
        Timer.toggle();
        Pages.replace("#console");
    }, function() {
        Pages.replace("#error");
    });
}


// The deck

function render_deck() {
    PDF.render(1, q("#slide-current canvas"));
    PDF.render(2, q("#slide-next canvas"));

    var slides = q("#slides-list");

    // Remove all the slides from the list
    while (slides.firstChild) {
        slides.removeChild(slides.firstChild);
    }

    var new_slide, new_canvas;
    for (var page = 1; page <= PDF.total_pages(); page++) {
        new_slide = document.createElement("div");
        new_slide.id = "slide-preview-"+page;
        new_slide.classList.add("slide-preview");

        if (page === 1) {
            new_slide.classList.add("active");
        }

        new_canvas = document.createElement("canvas");
        new_slide.appendChild(new_canvas);

        slides.appendChild(new_slide);

        PDF.render(page, new_canvas);
    }
}


// Initialization

Pages.init();
Timer.init();
PDF.init();

Pages.push("#intro");
