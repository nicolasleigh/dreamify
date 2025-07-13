.PHONY: docker/build
docker/build:
	docker build --platform=linux/amd64 -t dreamify:1.0 .

.PHONY: docker/save
docker/save:
	docker save -o dreamify.tar dreamify:1.0

.PHONY: remote/create_folder
remote/create_folder:
	ssh nicolas@106.14.126.186 "mkdir -p ~/dreamify"

.PHONY: docker/send
docker/send:
	rsync -avz dreamify.tar nicolas@106.14.126.186:~/dreamify

.PHONY: remote/docker_load
remote/docker_load:
	ssh nicolas@106.14.126.186 "sudo -S docker load -i ~/dreamify/dreamify.tar"

# Remote server docker run command:
# sudo docker run -d -p 3001:3001 --name dreamify-container dreamify:1.0

# Remove container
# sudo docker rm dreamify-container