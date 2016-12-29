/* Copyright (C) 2016  Pietro Albini <pietro@pietroalbini.org>
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
