/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Sequelize from 'sequelize';
import { databaseUrl } from '../config';

let databaseOpts = {
  define: {
    freezeTableName: true,
  }
};

// Use correct connection parameters for Heroku deployments
if (process.env.HEROKU) {
  databaseOpts = Object.assign(databaseOpts, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: true
    }
  });
}

const sequelize = new Sequelize(databaseUrl, databaseOpts);

export default sequelize;
