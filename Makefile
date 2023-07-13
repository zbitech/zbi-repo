build:
	npm run compile

dev:
	npm run dev

image:
	docker build -t ${ZBI_REPO}/zbi-control-plane:latest -t ${ZBI_REPO}/zbi-control-plane:${VERSION} .

