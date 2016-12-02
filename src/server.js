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
import difference from 'lodash/difference';
import filter from 'lodash/filter';
import includes from 'lodash/includes';

import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import models from './data/models';
import { User, Burner } from './data/models';
import routes from './routes';
import assets from './assets'; // eslint-disable-line import/no-unresolved
import sequelize from './data/sequelize';
import { port } from './config';
import { oauth2, OAUTH_URI } from './constants/oauth';
import { decrypt } from './core/encryption';
import BurnerApi from './core/BurnerApi';

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const IN_DEVELOPMENT = process.env.NODE_ENV !== 'production';
const COOKIE_MAX_AGE = 90 * 24 * 60 * 60 * 1000; // Only log in again after 3 months.
const SESSION = {
  secret: process.env.SESSION_SECRET,
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
const router = express.Router();

if (!IN_DEVELOPMENT) {
  app.set('trust proxy', 1); // trust first proxy

  SESSION.cookie.secure = true; // serve secure cookies

  // Force redirect to SSL
  app.get('*', (req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      res.redirect(process.env.CLIENT_URL + req.url);
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
  const options = {code};

  oauth2.authorizationCode.getToken(options, (error, result) => {
    if (error) {
      return next(error);
    }

    const burners = result.connected_burners;
    const authorizedBurnerIds = burners.map(burner => burner.id);

    const tokenResult = oauth2.accessToken.create(result);
    const burnerUpsertCalls = [];
    let currentUser;

    // Add any new connected burners for this user to the database. If the token for this
    // user has changed, update all authorized burners to reference the new user object.
    User.findOrCreateByToken(tokenResult.token.access_token)
      .then((user) => {
        currentUser = user;

        // Save the token to the session.
        req.session.token = currentUser.token; // eslint-disable-line no-param-reassign

        return currentUser.getBurners();
      })
      .then(storedBurners => {
        const storedBurnerIds = storedBurners.map(burner => burner.id);

        // If the list of Burner IDs we have stored isn't equal to what's
        // been returned, create some new ones.
        const newBurnerIds = difference(authorizedBurnerIds, storedBurnerIds);

        newBurnerIds.forEach(burnerId => {
          burnerUpsertCalls.push(Burner.upsert({id: burnerId, userId: currentUser.id}));
        });

        Promise.all(burnerUpsertCalls)
          .then(() => {
            // Redirect to the dashboard
            return res.redirect('/dashboard');
          })
      })
      .catch(err => next(err));
  });
});

//
// Burner API calls
// -----------------------------------------------------------------------------

function setupBurnerApi(req) {
  // Store the encrypted and decrypted authorization tokens
  req.encryptedToken = req.session.token;
  req.token = decrypt(req.encryptedToken);

  // Instantiate the API client
  req.burnerApiClient = new BurnerApi(req.token, process.env.BURNER_API_BASE_URL);
};

// Fail API requests if unauthorized
router.use('/', (req, res, next) => {
  if (!req.session.token) return res.sendStatus(400);

  setupBurnerApi(req);

  next();
});

app.use('/api', router);

app.get('/api/burners', (req, res, next) => {
  req.burnerApiClient.fetchBurners()
    .then(burners => {
      User
        .find({
          where: {token: req.encryptedToken},
          include: [Burner]
        })
        .then(user => {
          const storedBurnerIds = user.Burners.map(burner => burner.id);

          // If the list of Burner IDs we have stored isn't equal to what's
          // been returned, only return what has been stored, as those are the only
          // authorized burners.
          const authorizedBurners = filter(burners, (burner) => includes(storedBurnerIds, burner.id));

          return res.json(authorizedBurners);
        });
    })
    .catch(err => next(err));
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

    setupBurnerApi(req);

    const route = await UniversalRouter.resolve(routes, {
      path: req.path,
      query: req.query,
      token: req.token,
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
