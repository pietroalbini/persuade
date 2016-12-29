# Copyright (C) 2016 Pietro Albini <pietro@pietroalbini.org>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

#########################
#  Build configuration  #
#########################

DIR_SOURCE = src
DIR_BUILD = build
DIR_DEST = $(DIR_BUILD)/app
DIR_ENV = $(DIR_BUILD)/env

BIN_PYTHON = python3
BIN_VIRTUALENV = virtualenv


#######################
#  Assets definition  #
#######################

JS = \
	vendor/pdf-js/pdf.min.js \
	vendor/fullscreen-api-polyfill/fullscreen-api-polyfill.min.js \
	js/app/utils.js \
	js/app/pages.js \
	js/app/keyboard.js \
	js/app/timer.js \
	js/app/pdf.js \
	js/app/popup.js \
	js/app/console.js \
	js/app.js
JS := $(patsubst %,$(DIR_SOURCE)/assets/%,$(JS))

CSS = \
	vendor/snowflake-css/snowflake.min.css \
	vendor/font-awesome/css/font-awesome.min.css \
	css/app.css
CSS := $(patsubst %,$(DIR_SOURCE)/assets/%,$(CSS))


#############
#  Generic  #
#############

.PHONY: all
all: build

$(DIR_ENV): requirements.txt
	@mkdir -p $(dir $@)
	@$(BIN_VIRTUALENV) -p $(BIN_PYTHON) $@
	@$@/bin/pip install -r $<


####################
#  Build creation  #
####################

.PHONY: build
build:  $(DIR_DEST)/index.html $(DIR_DEST)/assets/css/app.css \
		$(DIR_DEST)/assets/js/app.js $(DIR_DEST)/assets/js/pdf.worker.js \
		$(patsubst \
			$(DIR_SOURCE)/assets/vendor/font-awesome/%, \
			$(DIR_DEST)/assets/%, \
			$(wildcard \
				$(DIR_SOURCE)/assets/vendor/font-awesome/fonts/fontawesome-* \
			) \
		)

$(DIR_DEST)/index.html: $(DIR_SOURCE)/index.html | $(DIR_ENV)
	@mkdir -p $(dir $@)
	@cat $< | sed '/<\!\-\-BUILD:REMOVE\-\->/,/<\!\-\-BUILD:KEEP\-\->/d' | \
		$(DIR_ENV)/bin/pyminify /proc/self/fd/0 > $@

$(DIR_DEST)/assets/css/app.css: $(CSS) | $(DIR_ENV)
	@mkdir -p $(dir $@)
	@cat $^ | $(DIR_ENV)/bin/python -m rcssmin > $@

$(DIR_DEST)/assets/js/app.js: $(JS) | $(DIR_ENV)
	@mkdir -p $(dir $@)
	@cat $^ | $(DIR_ENV)/bin/python -m rjsmin > $@

$(DIR_DEST)/assets/js/pdf.worker.js: \
		$(DIR_SOURCE)/assets/vendor/pdf-js/pdf.worker.min.js | $(DIR_ENV)
	@mkdir -p $(dir $@)
	@cat $^ | $(DIR_ENV)/bin/python -m rjsmin > $@

$(DIR_DEST)/assets/fonts/fontawesome-%: \
		$(DIR_SOURCE)/assets/vendor/font-awesome/fonts/fontawesome-%
	@mkdir -p $(dir $@)
	@cp $< $@


#############
#  Cleanup  #
#############

.PHONY: clean
clean:
	@rm -rf $(DIR_BUILD)
