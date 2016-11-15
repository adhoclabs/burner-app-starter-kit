/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import BurnerCookie from '../../core/BurnerCookie';

const title = 'Dashboard';

export default {

  path: '/dashboard',

  async action() {
    if (!BurnerCookie.isAuthenticated()) {
      return { redirect: '/login' };
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
