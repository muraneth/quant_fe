version = 0.1.5
container_name = quant_fe_pre_container
image_name = quant_fe_pre:$(version)

.PHONY: pull build stop run

all : pull build-docker stop run

pull:
	git pull

# Uncomment the line below if you need to run a build command
# build:
# 	npm run build

build-docker:
	docker build -t $(image_name) .

stop:
	docker stop $(shell docker ps -f 'name=$(container_name)' -q)

run:
	docker run -d --name $(container_name) -p 3001:3001 $(image_name)