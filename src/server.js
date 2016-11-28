/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import 'babel-polyfill';
import path from 'path';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import React from 'react';
import ReactDOM from 'react-dom/server';
import UniversalRouter from 'universal-router';
import PrettyError from 'pretty-error';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import models from './data/models';
import { User } from './data/models';
import routes from './routes';
import assets from './assets'; // eslint-disable-line import/no-unresolved
import configureStore from './store/configureStore';
import { setRuntimeVariable } from './actions/runtime';
import sequelize from './data/sequelize';
import { port } from './config';
import { oauth2, OAUTH_URI } from './constants/oauth';

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const IN_DEVELOPMENT = process.env.NODE_ENV !== 'production';
const COOKIE_MAX_AGE = 90 * 24 * 60 * 60 * 1000; // Only log in again after 3 months.
const SESSION = {
  secret: process.env.BURNER_APP_STARTER_KIT_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: false,
    maxAge: COOKIE_MAX_AGE,
  },
  store: new SequelizeStore({
    db: sequelize,
    expiration: COOKIE_MAX_AGE,
  }),
};

const app = express();

if (!IN_DEVELOPMENT) {
  app.set('trust proxy', 1); // trust first proxy

  SESSION.cookie.secure = true; // serve secure cookies

  // Force redirect to SSL
  app.get('*', (req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      res.redirect(process.env.BURNER_APP_STARTER_KIT_CLIENT_URL + req.url);
    } else {
      next();
    }
  });
}

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.json());
app.use(session(SESSION));

//
// OAuth
// -----------------------------------------------------------------------------

app.get('/api/oauth-uri', async (req, res) => {
  res.send(OAUTH_URI);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/auth/burner/callback', (req, res, next) => {
  const code = req.query.code;
  const options = {
    code,
  };

  oauth2.authorizationCode.getToken(options, (error, result) => {
    if (error) {
      console.error('Access Token Error', error.message);
      return res.json('Authentication failed');
    }

    const tokenResult = oauth2.accessToken.create(result);

    let currentUser;

    User.findOrCreateByToken(tokenResult.token.access_token)
      .then((user) => {
        currentUser = user;

        // Save the token to the session.
        req.session.token = currentUser.token; // eslint-disable-line no-param-reassign

        // Redirect to the dashboard
        res.redirect('/dashboard');
        return;
      })
      .catch((err) => {
        console.error(err);

        res.status(500).send(err);
        return next(err);
      });
  });
});

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const css = new Set();

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach(style => css.add(style._getCss()));
      },
    };

    const route = await UniversalRouter.resolve(routes, {
      path: req.path,
      query: req.query,
    });

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    if (route.oauthRedirect) {
      res.redirect(OAUTH_URI);
      return;
    }

    const data = { ...route };
    data.children = ReactDOM.renderToString(<App context={context}>{route.component}</App>);
    data.style = [...css].join('');
    data.scripts = [
      assets.vendor.js,
      assets.client.js,
    ];
    if (assets[route.chunk]) {
      data.scripts.push(assets[route.chunk].js);
    }

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)); // eslint-disable-line no-console
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      style={errorPageStyle._getCss()} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
/* eslint-disable no-console */
models.sync().catch(err => console.error(err.stack)).then(() => {
  app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}/`);
  });
});
/* eslint-enable no-console */
