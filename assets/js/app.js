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


// Load a file
function load_file(file) {
    Pages.push("#loading");

    // Read the file
    var reader = new FileReader();
    reader.onload = function() {
        PDF.load(new Uint8Array(reader.result), function() {
            Pages.replace("#setup");
        }, function() {
            Pages.replace("#load-local-error");
        });
    };
    reader.readAsArrayBuffer(file);
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

q("#click-local-file").addEventListener("click", function() {
    q("#local-file").click();
});

q("#local-file").addEventListener("change", function(e) {
    var files = e.target.files;

    var found = false;
    for (var i = 0; i < files.length; i++) {
        if (files[i].type === "application/pdf") {
            load_file(files[i]);
            return;
        }
    }

    Pages.push("#load-local-error");
});

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
