/* Copyright (C) 2016-2017  Pietro Albini <pietro@pietroalbini.org>
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

// Get slides URL from the intro page
q("#pdf-url-form").addEventListener("submit", function(e) {
    e.preventDefault();
    load_url(q("#pdf-url").value);
});


// Load an URL
function load_url(url) {
    // Add http:// before the URL if it doesn't have a protocol
    if (url.indexOf("://") === -1) {
        url = "http://" + url;
    }

    Pages.push("#loading");

    PDF.load(url, function() {
        Pages.replace("#setup");
    }, function() {
        Pages.replace("#load-url-error");
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

function load_files(files) {
    var found = false;
    for (var i = 0; i < files.length; i++) {
        if (files[i].type === "application/pdf") {
            load_file(files[i]);
            return;
        }
    }

    Pages.push("#load-local-error");
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
    var auto_start_timer = q("#auto-start-timer").checked;
    var allow_black_white = q("#allow-black-white").checked;

    Console.init(block_f5, allow_black_white);

    if (Timer.is_paused()) {
        Timer.set_paused(false);
    } else {
        Timer.set_status(auto_start_timer);
    }
});

Pages.on_hide("#console", function() {
    Timer.set_paused(true);
})


// Local files loading

q("#click-local-file").addEventListener("click", function() {
    q("#local-file").click();
});

q("#local-file").addEventListener("change", function(e) {
    var files = e.target.files;
    load_files(files);
});

q("#drop-zone").addEventListener("dragover", function(e) {
    e.stopPropagation();
    e.preventDefault();

    e.dataTransfer.dropEffect = "copy";
    q("#drop-zone").classList.add("hover");
});

q("#drop-zone").addEventListener("dragleave", function(e) {
    e.stopPropagation();
    e.preventDefault();

    q("#drop-zone").classList.remove("hover");
});

q("#drop-zone").addEventListener("drop", function(e) {
    e.stopPropagation();
    e.preventDefault();

    var files = e.dataTransfer.files;
    load_files(files);
})

window.addEventListener("dragover", function(e) {
    e.preventDefault();

    e.dataTransfer.dropEffect = "none";
});

window.addEventListener("drop", function(e) {
    e.preventDefault();
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
