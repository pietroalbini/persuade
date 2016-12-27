window.PDF = {

    pdf: null,
    url: null,

    worker_src: "assets/js/pdf.worker.js",

    init: function() {
        PDFJS.workerSrc = this.worker_src;
    },

    load: function(url, ok, err) {
        // Check if the schema is correct
        var allowed_schemas = ["http", "https"];
        var success = false;
        for (var i = 0; i < allowed_schemas.length; i++) {
            if (url.indexOf(allowed_schemas[i]) === 0) {
                success = true;
            }
        }
        if (success === false) {
            err();
        }

        PDFJS.getDocument(url).then(function(pdf) {
            this.pdf = pdf;
            this.url = url;

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
