IMGTAG=app
CONTAINERNAME=app

all: build run

.PHONY: lint
lint:
	docker run --rm -it -v $(PWD):/app --name $(CONTAINERNAME)_lint $(IMGTAG) eslint -f compact '**/*.js'

.PHONY: test
test: lint
	echo "add some damn tests!"
