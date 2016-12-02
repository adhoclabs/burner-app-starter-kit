/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable global-require */

import React from 'react';
import fetch from '../../core/fetch';
import BurnerCookie from '../../core/BurnerCookie';
import Home from '../home/Home';

const title = 'Dashboard';

export default {

  path: '/dashboard',

  async action(context) {
    console.log('rendering dashboard');
    let burners = [];

    // If the route is being fired client-side...
    if (typeof window !== 'undefined') {

      // If we are not authenticated...
      if (!BurnerCookie.isAuthenticated()) {
        // ...fetch the OAuth URI from the server and redirect.
        const response = await fetch( '/api/oauth-uri' );
        const OAUTH_URI = await response.text();

        window.location = OAUTH_URI;

        // Simply re-render the homepage
        return {
          title: '',
          component: <Home />,
        };
      // If we are authenticated
      } else {
        const resp = await fetch('/api/burners', {credentials: 'same-origin'});
        if (resp.status !== 200) throw new Error(resp.statusText);
        burners = await resp.json();
      }
      // If this route is firing server-side and is not authenticated...
    } else if (typeof window === 'undefined' && typeof context.token === 'undefined') {
      // instruct the router to fire an OAuth redirect.
      return {oauthRedirect: true};
    }

    const Dashboard = await new Promise((resolve) => {
      require.ensure([], (require) => resolve(require('./Dashboard').default), 'dashboard');
    });

    return {
      title,
      chunk: 'dashboard',
      component: <Dashboard title={title} burners={burners}/>,
    };
  },

};
