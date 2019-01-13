.PHONY: build clean

build:
	make -C website
	make -C src
	rsync -a --delete build/app/ build/website/app/
	@rm -f build/website/persuade.zip
	cd build && zip -r website/persuade.zip app/

clean:
	@rm -rf build
