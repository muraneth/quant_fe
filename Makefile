version = 0.2.1_release
container_name = quant_fe_pre_container
image_name = quant_fe_pre:$(version)

docker_hub_username = manaconnan

.PHONY: pull build stop run

# all : pull build build-docker stop run

pull:
	git pull

# Uncomment the line below if you need to run a build command
build:
	npm install
	npm run build

build-docker: build
	docker build -t $(image_name) .

stop: build-docker
	docker stop  $(shell docker ps -f 'name=$(container_name)' -q)
	docker rm $(shell docker ps -a -f 'name=$(container_name)' -q)

run: stop
	docker run -d --name $(container_name) -p 3001:3001 $(image_name)

docker: build-docker
     
	docker tag $(image_name) $(docker_hub_username)/$(image_name)
	docker push $(docker_hub_username)/$(image_name)
