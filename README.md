# Burner App Starter Kit

The Burner App Starter Kit helps you quickly get started building apps for [Burner](http://www.burnerapp.com/) disposable phone numbers. This starter kit is a fork of [React Starter Kit](https://www.reactstarterkit.com/), meaning it's built on a React/Express/Node stack.

## Table of Contents

  * [Getting Started](#getting-started)
     * [Requirements](#requirements)
     * [Installation](#installation)
  * [Deploying to Heroku](#deploying-to-heroku)
  * [Staying up to date](#staying-up-to-date)
  * [More Resources](#more-resources)

## Getting Started

### Requirements

  * Mac OS X, Windows, or Linux
  * [Node.js](https://nodejs.org/) v6.5 or newer
  * `npm` v3.10 or newer (new to [npm](https://docs.npmjs.com/)?)
  * `node-gyp` prerequisites mentioned [here](https://github.com/nodejs/node-gyp)
  * [PostgreSQL](https://www.postgresql.org/) v9.4 or newer
  * Text editor or IDE pre-configured with React/JSX/Flow/ESlint ([learn more](./how-to-configure-text-editors.md))

### Installation

#### 1. Get the latest version

You can start by cloning the latest version of Burner App Starter Kit (BASK) on your local machine by running:

```shell
$ git clone -o burner-app-starter-kit -b master --single-branch \
      https://github.com/adhoclabs/burner-app-starter-kit MyApp
$ cd MyApp
```

#### 2. Run `npm install`

This will install both run-time project dependencies and developer tools listed
in [package.json](../package.json) file.

#### 3. Set up database

The app uses [Sequelize](http://sequelizejs.com/) to store data in a [PostgreSQL](https://www.postgresql.org/) database. Open `psql` and run the following command to create a new database:

```sql
CREATE DATABASE "burner-app-starter-kit-development";
```
#### 4. Request Burner OAuth app credentials

If you haven't already, request Burner OAuth credentials for your new app.

#### 5. Configure environment variables

BASK uses [node-foreman](https://github.com/strongloop/node-foreman) to manage environment variables. Copy the example `.env` file to your project:

```console
$ cp .env.example .env
```

Now open the `.env` file in your editor and supply the following values indicated below:

```javascript
{
  "burner_api": {
    "base_url": "http://api.burnerapp.com",
    "version": "2.1.10"
  },
  // Change the following to configure the database connection. Can be left as-is.
  "database_url": "postgresql://localhost:5432/burner-app-starter-kit-development",
  "oauth": {
    "client_id": "", // The OAuth client ID you received for your new Burner app.
    "client_secret": "", // The OAuth client secret you received.
    "authorize_host": "http://app.burnerapp.com/",
    "callback_url": "http://localhost:3001/auth/burner/callback", 
    "state_secret": "" // The OAuth state secret. (randomkeygen.com)
  },
  "client_url": "http://localhost:3001/",
  "key_encryption_password": "", // The key used to encrypt authorization tokens. (randomkeygen.com)
  "session_secret": "", // The secret used to encrypt session data. (randomkeygen.com)
  "heroku_app_name": "" // If you set up Heroku deployment, set to the name of your app. (optional)
}
```

#### 6. Run `npm start`

Start the development environment by running:

```console
$ npm start
```

This command will build the app from the source files (`/src`) into the output
`/build` folder. As soon as the initial build completes, it will start the
Node.js server (`node build/server.js`) and [Browsersync](https://browsersync.io/)
with [HMR](https://webpack.github.io/docs/hot-module-replacement) on top of it.

> [http://localhost:3000/](http://localhost:3000/) — Node.js server (`build/server.js`)<br>
> [http://localhost:3001/](http://localhost:3001/) — BrowserSync proxy with HMR, React Hot Transform<br>
> [http://localhost:3002/](http://localhost:3002/) — BrowserSync control panel (UI)

Now you can open your web app in a browser, on mobile devices and start
hacking. Whenever you modify any of the source files inside the `/src` folder,
the module bundler ([Webpack](http://webpack.github.io/)) will recompile the
app on the fly and refresh all the connected browsers.

Note that the `npm dev` command launches the app in `development` mode,
the compiled output files are not optimized and minimized in this case.
You can use `--release` command line argument to check how your app works
in release (production) mode:

```shell
$ npm start -- --release
```

## Deploying to Heroku

### 1. Click the Deploy to Heroku button

To begin deploying your app to Heroku, click the button below and follow the prompts to create a new Heroku app:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

This will create a base app for you based on the code in this repository. The deploy should fail, as the purpose of clicking the button was merely to create a new app with the proper settings and resources attached. 

### 2. Set up the proper git remote

Head to the settings page on Heroku for your newly created app, and find the "Git URL" listed there. Run the following command to set up this new app as your staging server for deployment, being sure to substitute your own repo URL:

```console
$ git remote add staging https://git.heroku.com/YOURAPPNAME.git
```

### 3. Configure app name in `.env`

Open the `.env` file and add your app's Heroku name as `heroku_app_name`.

### 3. Run `npm run deploy`

Run the following command to build and then deploy your app to Heroku:

```console
$ npm run deploy
```

## Staying up to date

If you need to keep your project up to date with the recent changes made to BASK,
you can always fetch and merge them from [this repo](https://github.com/adhoclabs/burner-app-starter-kit)
back into your own project by running:

```shell
$ git checkout master
$ git fetch burner-app-starter-kit
$ git merge burner-app-starter-kit/master
$ npm install
```

## More Resources

* [Burner Developer Center](http://www.burnerapp.com/developer/)
* [Directory layout](https://github.com/kriasoft/react-starter-kit/blob/master/docs/getting-started.md#directory-layout)
* [React Starter Kit documentation](https://github.com/kriasoft/react-starter-kit/tree/master/docs)