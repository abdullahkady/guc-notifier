<h1 align="center">
  <img src="/web-application/public/favicon.png"/>
  GUC Notifier
  <img src="/web-application/public/favicon.png"/>
</h1>

<p align="center">Get email notifications when your grades are updated!</p>

## Introduction

The project is built in a microservice-like architecture, where it consists of 3 independant applications :
- [GUC REST Wrapper](https://github.com/AbdullahKady/guc-rest-api-wrapper)
- [Notifier](https://github.com/AbdullahKady/guc-notifier/tree/master/notifier)
- [Web-application](https://github.com/AbdullahKady/guc-notifier/tree/master/web-application)

## Acknowledgement

Special thanks to [A.R Maged](https://github.com/ar-maged) for his [graphql-guc project](https://github.com/ar-maged/graphql-guc).
His parser source code is used in the [API wrapper](https://github.com/AbdullahKady/guc-rest-api-wrapper/tree/master/src/parser) to parse the GUC's API response.

## Technologies

#### Main technologies
- Node.JS (+8)
- MongoDB
- [SendGrid](https://sendgrid.com/) (Mailing service)

## Usage

- Clone the repo, as well as the [API](https://github.com/AbdullahKady/guc-rest-api-wrapper)
- Install each of the 3 application's dependencies:
```bash
$ cd <PROJECT_DIRECTORY>/ && npm install
```
- Specify reuired environment variables:
> For each application, specify the required environment variables, you can use the `.env.sample` files to see the required variables, and then define a `.env` file for each application (in it's directory).

- In case of running mongo locally, make sure it's installed, and a daemon instance is running. [Instructions](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

- Start the applications in the following order (since they're dependant on each other):
  * guc-api
  * guc-notifier/notifier
  * guc-notifier/web-application
```bash
$ cd <PROJECT_DIRECTORY>/ && npm start
```
You're done ! Open up your browser, and visit `localhost` on the port specified for the web-application

## Usage with Docker
You can run a container out of each application's image, by going into the application directory's, and running:
```bash
$ docker container build -t <CUSTOM_TAG> .
$ docker container run <CUSTOM_TAG>
```
However, that way you will need to create a custom docker-network, so that your 3 applications can communicate successfully, and expose only the web-application to the host machine; using the port flag while running `-p <HOST_PORT>:<CONTAINER_PORT>`

### Usage with docker-compose
*Make your life easier using **docker-compose** !!*

The [yaml file](https://github.com/AbdullahKady/guc-notifier/blob/master/docker-compose.yml) handles the configuration so that your applications will have their own network, and expose the needed ports.

*NOTE:* The `compose` file is setup assuming all the 3 projects exist in the same directory, change the `build` path for each image accordingly.

- Specify your enviroment variables for each application as stated above
- Run `$ docker-compose up`
  - Add an optional `--build` flag to make sure that the images will be **rebuilt**
  - Add an optional `--detach` flag to detach the terminal from the docker-compose process
- Open your browser and visit http://localhost
