# Docker README

## Dockerfile
The Dockerfile is used to build the docker image. It is a text file that contains all the commands a user could call on the command line to assemble an image. Using `docker build` users can create an automated build that executes several command-line instructions in succession.

## Using the image

The image is already built and available on Docker Hub. It is the `theecgaming/ectobot` image.

The image is based on the official [Node 20](https://hub.docker.com/_/node/) image.

Before running the image, you'll need to get your environment variables ready by getting them from the self-hosted setup in [Ectobot's Dashboard](https://ectobot.app).

## Building the image

To build the image, run the following command in the root directory of the repository:

```bash
docker build -t theecgaming/ectobot:<tag> .
```

## Pushing the image

**Note:** This is only for maintainers of the repository.

To push the image to Docker Hub, run the following command in the root directory of the repository:

```bash
docker push theecgaming/ectobot:<tag>
```