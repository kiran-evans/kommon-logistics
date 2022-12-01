# Kommon Logistics
**by Kiran Evans**
## Introduction
Kommon Logistics is a full-stack application built with the MERN technology stack. It exists in two parts: `/api/` was built using *Node.js*, *Express.js* and *MongoDB*; `/client/` was built using *React*. It was built as a continuation of the group project [qommon-logistics](https://github.com/kiran-evans/qommon-logistics) - an app developed over the course of 36 hours as part of a competition. I wanted to finish the project as we did not have time to develop it to its full potential.

## Purpose
Kommon Logistics is a web application used by a logistics company. It allows two types of *user* - *drivers* and *managers* - to manage *deliveries*.

## About the Development
The source code from [qommon-logistics](https://github.com/kiran-evans/qommon-logistics) was first copied to a new repository.

The `/client/` was recreated using *Vite* instead of *create-react-app*. This was a new technology to me; I wanted to try it because of the advertised performance advantages over *create-react-app*. I did find that *Vite* was noticeably more performant than *create-react-app*, but I also liked that it provided a much cleaner application boilerplate and easy custom configuration.

The `/api/` was almost entirely rewritten to be much more robust and secure. I also redesigned the database schemas to provide easy routes for future extensibility.

The project's packages were managed by *yarn* instead of *npm*. This was a personal preference based on *yarn*'s appearance in the CLI, but it is also generally more performant than *npm*.

## How To Use
You may clone this repository and use the app if you wish. Once you have cloned the source code and installed the required packages, you need to configure the `/api/` and `/client/`.

### Setup Configs

#### `/api/`
In the `/config/` directory, create `config.env`. This file must contain the following:
```
PORT=
CLIENT_URL=
MONGO_URI=
MAIL_USER=
MAIL_PASSWORD=
```
`PORT`
: The port you wish to run the `/api/` on. *Integer* e.g. `5000`

`CLIENT_URL`
: The URL of the `/client/` app. *String* e.g. `'https://www.kommonlogistics.com/'`

`MONGO_URI`
: The URI of you *MongoDB* database, including the username and password for the database. *String* e.g. `'mongodb+srv://username:password@cluster0.123abc.mongodb.net/?retryWrites=true&w=majority'`

`MAIL_USER`
: The username of your chosen mail service. *String* e.g. `'no-reply@kommonlogistics.com'`

`MAIL_PASSWORD`
: The password for `MAIL_USER`. **Note: your chosen mail service may require you to generate a unique password for using this app which is different to your usual password.** *String* e.g. `'password123'`

#### `/client/`
In the `/config/` directory, create `.env.development`. This can be in addition to any other *env* files relevant to the mode you choose. See the [Vite website](https://vitejs.dev/guide/env-and-mode.html#modes) for more information. Your *env* file(s) must contain the following:
```
KL_API_URL=
KL_TOM_TOM_API_KEY=
KL_APP_TITLE=
```
`KL_API_URL`
: The URL of the `/api/` app. *String* e.g. `'https://api.kommonlogistics.com/'`

`KL_TOM_TOM_API_KEY`
: Your unique TomTom Developers key. This can be acquired from the [TomTom Developers website](https://developer.tomtom.com/). *String* e.g. `'abcde12345ABCDE54321'`

`KL_APP_TITLE`
: The name of the app used as its title in the current mode. *String* e.g. `'(DEV) Kommon Logistics'`

### Setup Your Database
Before using the app for the first time, you must create a *manager* user in your database. You can do this by:
1. manually adding an entry in your database according to the schema in `/model/userSchema.js`, or
2. by starting the `/api/` by running the `start` script and then using software such as *Postman* to `POST` an entry.

### Running the App
To start the `/api/`, run the `start` script. To start the client, run the script for your chosen mode (e.g. `dev`). You can see all available scripts in the `package.json` file.

Navigate to your client URL and login using your *manager* user credentials. You can then use the app to create more users as required.