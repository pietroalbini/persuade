// Get slides URL from the intro page
q("#pdf-url-form").addEventListener("submit", function(e) {
    e.preventDefault();
    load_url(q("#pdf-url").value);
});


// Load an URL
function load_url(url) {
    Pages.push("#loading");

    PDF.load(url, function() {
        Timer.toggle();
        Console.init();
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
