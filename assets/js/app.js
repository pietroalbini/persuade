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


// Reflowing

function reflow() {
    // Get the window height
    var body = document.body,
        html = document.documentElement;
    var height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
    );
    var width = Math.max(
        body.scrollWidth,
        body.offsetWidth,
        html.clientWidth,
        html.scrollWidth,
        html.offsetWidth
    );

    var container_el = q(".console-container");
    var deck_el = q(".deck");

    var container_height = height - q(".timer").offsetHeight - 1;
    var deck_height = container_height - 1 -
        parseInt(css(".deck", "margin-top")) -
        parseInt(css(".deck", "margin-bottom"));
    var deck_width = q(".console-container").offsetWidth - 1;

    var slide_height_max = deck_height - 1;
    var slide_width_max = (deck_width - 1) / 2 - q("#slide-arrow i.fa").offsetWidth;

    q(".console-container").style.height = container_height + "px";
    q(".deck").style.height = deck_height + "px";

    qe(".slide", function(slide) {
        slide.style.height = slide_height_max + "px";
        slide.style.width = slide_width_max + "px";
    });

    if (height < 600 || width < 800) {
        Pages.push("#too-small");
    } else {
        Pages.back("#too-small");
    }
}

window.addEventListener("resize", reflow);


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
