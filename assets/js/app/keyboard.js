window.Keyboard = {

    binds: {},

    init: function() {
        document.addEventListener("keydown", function(e) {
            this.process_keypress(e);
        }.bind(this));
    },

    process_keypress: function(e) {
        var key = e.which || e.keyCode + "";

        if (this.binds.hasOwnProperty(key) === false) {
            return;
        }

        for (var i = 0; i < this.binds[key].length; i++) {
            var result = this.binds[key][i]();

            if (result === true) {
                e.preventDefault();
                return;
            }
        }
    },

    bind: function(key, callback) {
        if (this.binds.hasOwnProperty(key) === false) {
            this.binds[key + ""] = [];
        }

        this.binds[key + ""].push(callback);
    },

};
