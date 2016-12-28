window.q = function(query) {
    return document.querySelector(query);
}

window.qe = function(query, func) {
    var elements = document.querySelectorAll(query);
    for (var i = 0; i < elements.length; i++) {
        func(elements[i]);
    }
}

window.css = function(query, property) {
    return window.getComputedStyle(q(query)).getPropertyValue(property);
}
