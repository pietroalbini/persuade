window.PDF = {

    pdf: null,

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
            ok();
        }.bind(this), err);
    },

    render: function(page, on) {
        this.pdf.getPage(page).then(function(page) {
            // Load the canvas
            var canvas = q(on);
            var context = canvas.getContext("2d");

            var height = page.view[3] - page.view[1];
            var width = page.view[2] - page.view[0];

            var parent = canvas.parentNode;

            var scale;
            if (height > width) {
                scale = parent.offsetHeight / height;
                height = parent.offsetHeight;
                width = width * scale;
            } else {
                scale = parent.offsetWidth / width;
                width = parent.offsetWidth;
                height = height * scale;
            }

            var viewport = page.getViewport(scale);

            canvas.height = height;
            canvas.width = width;

            var height_diff = parent.offsetHeight - height;
            if (height_diff > 0) {
                canvas.style.paddingTop = (height_diff / 2 - 1) + "px";
            }

            var width_diff = parent.offsetWidth - width;
            if (width_diff > 0) {
                canvas.style.paddingLeft = (width_diff / 2 - 1) + "px";
            }

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
