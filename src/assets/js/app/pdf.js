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

window.PDF = {

    pdf: null,
    data: null,

    worker_src: "assets/vendor/pdf-js/pdf.worker.min.js",

    init: function() {
        PDFJS.workerSrc = this.worker_src;
    },

    load: function(data, ok, err) {
        // Only for URLs, check if the schema is correct
        if (typeof data === typeof "") {
            var allowed_schemas = ["http", "https"];
            var success = false;
            for (var i = 0; i < allowed_schemas.length; i++) {
                if (data.indexOf(allowed_schemas[i]) === 0) {
                    success = true;
                }
            }
            if (success === false) {
                err();
            }
        }

        PDFJS.getDocument(data).then(function(pdf) {
            this.pdf = pdf;
            this.data = data;

            ok();
        }.bind(this), err);
    },

    render: function(page, canvas) {
        this.pdf.getPage(page).then(function(page) {
            // Reset the canvas sizes
            canvas.height = 0;
            canvas.width = 0;

            // Load the canvas
            var context = canvas.getContext("2d");

            var pdf_height = page.view[3] - page.view[1];
            var pdf_width = page.view[2] - page.view[0] - 1;

            var parent = canvas.parentNode;

            // This assumes border size is the same on all sides
            var parent_border = parseInt(
                window.getComputedStyle(parent)
                      .getPropertyValue("border-left-width")
            );

            var document_height = document.documentElement.clientHeight;
            var document_width = document.documentElement.clientWidth;

            var parent_height = parent.offsetHeight - parent_border * 2;
            if (parent_height === 0 || parent_height > document_height) {
                parent_height = document_height;
            }

            var parent_width = parent.offsetWidth - parent_border * 2;
            if (parent_width === 0 || parent_width > document_width) {
                parent_width = document_width;
            }

            var scale;
            if (pdf_height > pdf_width) {
                scale = parent_height / pdf_height;
                height = parent_height;
                width = pdf_width * scale;

                if (width > parent_width) {
                    scale = parent_width / pdf_width;
                    width = parent_width;
                    height = pdf_height * scale;
                }
            } else {
                scale = parent_width / pdf_width;
                width = parent_width;
                height = pdf_height * scale;

                if (height > parent_height) {
                    scale = parent_height / pdf_height;
                    height = parent_height;
                    width = pdf_width * scale;
                }
            }

            var viewport = page.getViewport(scale);

            canvas.height = height;
            canvas.width = width;

            page.render({
                canvasContext: context,
                viewport: viewport,
            });
        }.bind(this));
    },

    total_pages: function() {
        return this.pdf.numPages;
    },
};
