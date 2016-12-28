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

    bind: function(page, key, callback) {
        if (this.binds.hasOwnProperty(page) === false) {
            this.binds[page] = {};
        }

        if (this.binds[page].hasOwnProperty(key) === false) {
            this.binds[page][key + ""] = [];
        }

        this.binds[page][key + ""].push(callback);
    },

};
