## Persuade

*Simple presenter console for your PDFs, in your web browser.*

Persuade allows you to get the same experience of Impress/PowerPoint presenter
console in every web browser: you just need the PDFs of the slides, and you're
good to go!

Also, Persuade is just a bunch of HTML, CSS and JS files: it doesn't require
any web server running, so you can even download the source and use it offline
by opening the `index.html`!

The project is released under the GNU GPLv3+ license.

### Try it

| Branch | URL                                    |
| :----: | -------------------------------------- |
| master | https://persuade.pietroalbini.org/app/ |

### Features

Persuade currently has these features:

* Load slides from the local device, or any website allowing cross-origin
  requests
* Check the talk duration with the builtin timer, or turn it into a countdown
* External popup you can put in the projector to show the slides to the
  audience
* Most of the keyboard shortcuts of Impress/PowerPoint supported

### Future plans

In the future, I may add the following features:

* [Support for speaker notes][gh-1]
* [Allow loading PDFs from websites blocking cross-origin requests][gh-2]

If you want to contribute on those, please comment on the issue before creating
a pull request!

[gh-1]: https://github.com/pietroalbini/persuade/issues/1
[gh-2]: https://github.com/pietroalbini/persuade/issues/2

### Remotes support

Persuade should work with any remotes simulating keypresses. Currently, it has
been tested with the following hardware:

* LG Wireless Presenter R400

If you have any other hardware, and you tested it works, send a pull request!

### Third party dependencies

Persuade depends on these external projects:

* [Font Awesome 4][fa] icons by Dave Gandy, SIL OFL 1.1 license
* [Font Awesome 4][fa] CSS by Dave Gandy, MIT license
* [Fullscreen API Polyfill][fullscreen] by Nicolas Le Gall, MIT license
* [PDF.js][pdfjs] by Mozilla Labs, Apache 2.0 license
* [Snowflake][snowflake] by Pietro Albini, MIT license

The required files are bundled in the `src/assets/vendor` directory, along with
the licenses.

[fa]: http://fontawesome.io
[fullscreen]: https://github.com/neovov/Fullscreen-API-Polyfill
[pdfjs]: https://github.com/mozilla/pdf.js
[snowflake]: https://github.com/pietroalbini/snowflake-css
