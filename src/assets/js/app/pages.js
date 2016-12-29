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

window.Pages = {

    stack: ["#loading"],
    show_callbacks: {},
    hide_callbacks: {},

    goto_el: ".goto",

    init: function() {
        qe(this.goto_el, function(el) {
            el.addEventListener("click", function(e) {
                e.preventDefault();

                var to = el.attributes["data-to"].value;
                if (to === ":back") {
                    this.back();
                } else {
                    this.push(to);
                }
            }.bind(this));
        }.bind(this));
    },

    set: function(from, to) {
        // Call show callbacks
        if (this.show_callbacks.hasOwnProperty(to)) {
            for (var i = 0; i < this.show_callbacks[to].length; i++) {
                this.show_callbacks[to][i]();
            }
        }

        q(from).classList.add("hidden");
        q(to).classList.remove("hidden");

        // Call hide callbacks
        if (this.hide_callbacks.hasOwnProperty(from)) {
            for (var i = 0; i < this.hide_callbacks[from].length; i++) {
                this.hide_callbacks[from][i]();
            }
        }
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

    current: function() {
        return this.stack[this.stack.length - 1];
    },

    on_show: function(page, callback) {
        if (this.show_callbacks.hasOwnProperty(page) === false) {
            this.show_callbacks[page] = [];
        }

        this.show_callbacks[page].push(callback);
    },

    on_hide: function(page, callback) {
        if (this.hide_callbacks.hasOwnProperty(page) === false) {
            this.hide_callbacks[page] = [];
        }

        this.hide_callbacks[page].push(callback);
    },
};
