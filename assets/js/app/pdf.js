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

    render: function(page, canvas) {
        this.pdf.getPage(page).then(function(page) {
            // Load the canvas
            var context = canvas.getContext("2d");

            var height = page.view[3] - page.view[1];
            var width = page.view[2] - page.view[0];

            var parent = canvas.parentNode;

            // This assumes border size is the same on all sides
            var parent_border = parseInt(
                window.getComputedStyle(parent)
                      .getPropertyValue("border-left-width")
            );

            var parent_height = parent.offsetHeight - parent_border * 2;
            var parent_width = parent.offsetWidth - parent_border * 2;

            var scale;
            if (height > width) {
                scale = parent_height / height;
                height = parent_height;
                width = width * scale;
            } else {
                scale = parent_width / width;
                width = parent_width;
                height = height * scale;
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
