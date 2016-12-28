window.Keyboard = {

    binds: {},

    init: function() {
        document.addEventListener("keydown", function(e) {
            this.process_keypress(e);
        }.bind(this));
    },

    process_keypress: function(e) {
        var key = e.which || e.keyCode + "";
        var page = Pages.current();

        if (this.binds.hasOwnProperty(page) === false) {
            return;
        }

        if (this.binds[page].hasOwnProperty(key) === false) {
            return;
        }

        for (var i = 0; i < this.binds[page][key].length; i++) {
            var result = this.binds[page][key][i]();

            if (result === true) {
                e.preventDefault();
                return;
            }
        }
    },

    bind: function(pages, keys, callback) {
        for (var pi = 0; pi < pages.length; pi++) {
            var page = pages[pi];

            if (this.binds.hasOwnProperty(page) === false) {
                this.binds[page] = {};
            }

            for (var ki = 0; ki < keys.length; ki++) {
                var key = keys[ki];

                if (this.binds[page].hasOwnProperty(key) === false) {
                    this.binds[page][key + ""] = [];
                }

                this.binds[page][key + ""].push(callback);
            }
        }
    },

};
