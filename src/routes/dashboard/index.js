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

  async action() {
    // If we are not authenticated...
    if (typeof window !== 'undefined' && !BurnerCookie.isAuthenticated()) {
      // If this route is firing client-side...
      if (typeof window !== 'undefined') {
        // ...fetch the OAuth URI from the server and redirect.
        const response = await fetch('/api/oauth-uri');
        const OAUTH_URI = await response.text();

        window.location = OAUTH_URI;

        // Simply re-render the homepage
        return {
          title: 'Burner App Starter Kit',
          component: <Home />,
        };
      }

      // If this route is firing server-side, instruct the router to fire an OAuth redirect.
      return {
        oauthRedirect: true,
      };
    }

    const Dashboard = await new Promise((resolve) => {
      require.ensure([], (require) => resolve(require('./Dashboard').default), 'dashboard');
    });

    return {
      title,
      chunk: 'dashboard',
      component: <Dashboard title={title} />,
    };
  },

};
