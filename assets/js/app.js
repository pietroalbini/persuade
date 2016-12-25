// Get slides URL from the intro page
q("#pdf-url-form").addEventListener("submit", function(e) {
    e.preventDefault();
    load_url(q("#pdf-url").value);
});


// Load an URL
function load_url(url) {
    Pages.push("#loading");

    PDF.load(url, function() {
        refresh_deck();
        Timer.toggle();
        Pages.replace("#console");
    }, function() {
        Pages.replace("#error");
    });
}


// The deck

function refresh_deck() {
    // Update the total count of the pages
    qe(".total-pages", function(el) {
        el.innerHTML = "" + PDF.total_pages();
    });

    PDF.render(1, "#slide-current canvas");
    PDF.render(2, "#slide-next canvas");
}


// Initialization

Pages.init();
Timer.init();
PDF.init();

Pages.push("#intro");
