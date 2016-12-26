// Get slides URL from the intro page
q("#pdf-url-form").addEventListener("submit", function(e) {
    e.preventDefault();
    load_url(q("#pdf-url").value);
});


// Load an URL
function load_url(url) {
    Pages.push("#loading");

    PDF.load(url, function() {
        Pages.replace("#console");
    }, function() {
        Pages.replace("#error");
    });
}


// Initialization

Keyboard.init();
Pages.init();
Timer.init();
PDF.init();

Pages.push("#intro");


Pages.on_show("#console", function() {
    Timer.set_status(true);
    Console.init();
});


// Correctly handle screen resizes

var resize_timeout = null;

function on_resize() {
    if (window.innerHeight < 600 || window.innerWidth < 800) {
        Pages.push("#too-small");
    } else {
        Pages.back("#too-small");
    }

    // Don't render the console two times
    if (resize_timeout !== null) {
        window.clearTimeout(resize_timeout);
        resize_timeout = null;
    }

    // Delayed because it causes problems if done instantly
    resize_timeout = window.setTimeout(function() {
        if (Pages.current() === "#console") {
            Console.render()
        }
    }, 100);
}

window.addEventListener("resize", on_resize);
on_resize();
