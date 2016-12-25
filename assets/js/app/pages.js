window.Pages = {

    stack: ["#loading"],

    goto_el: ".goto",

    init: function() {
        qe(this.goto_el, function(el) {
            el.addEventListener("click", function(e) {
                e.preventDefault();

                var to = el.attributes["href"].value;
                if (to === ":back") {
                    this.back();
                } else {
                    this.push(to);
                }
            }.bind(this));
        }.bind(this));
    },

    set: function(from, to) {
        q(from).classList.add("hidden");
        q(to).classList.remove("hidden");

        reflow();
    },

    push: function(name) {
        // Don't push duplicate pages
        if (this.stack.indexOf(name) === this.stack.length - 1) { return; }

        this.stack.push(name);
        this.set(this.stack[this.stack.length - 2], name);
    },

    replace: function(name) {
        var current = this.stack.pop();
        this.stack.push(name);

        this.set(current, name);
    },

    back: function(only) {
        // Only pop some pages
        if (only !== undefined && only !== this.stack[this.stack.length - 1]) {
            return;
        }

        var current = this.stack.pop();
        this.set(current, this.stack[this.stack.length - 1]);
    },
};
