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
