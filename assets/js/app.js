// Get slides URL from the intro page
q("#pdf-url-form").addEventListener("submit", function(e) {
    e.preventDefault();
    load_url(q("#pdf-url").value);
});


// Load an URL
function load_url(url) {
    Pages.push("#loading");

    PDF.load(url, function() {
        Pages.replace("#setup");
    }, function() {
        Pages.replace("#error");
    });
}


// Initialization

Keyboard.init();
Pages.init();
Timer.init();
PDF.init();
Popup.init();


if (! Popup.is_popup()) {
    Pages.push("#intro");
}


Pages.on_show("#console", function() {
    // Load the esitimated talk duration
    var estimated = parseInt(q("#estimated-talk-duration").value);
    if (estimated) {  // Let's pray here nothing gets converted stupidly
        Timer.set_estimated(estimated);
    }

    var block_f5 = q("#block-f5").checked;

    Console.init(block_f5);
    Timer.set_status(true);
});

Pages.on_hide("#console", function() {
    Timer.set_status(false);
})


// Actions

qe(".open-popup", function(el) {
    el.addEventListener("click", function(e) {
        e.preventDefault();
        Popup.open();
    });
});


qe(".close-window", function(el) {
    el.addEventListener("click", function(e) {
        e.preventDefault();
        window.close();
    });
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
