/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import DataType from 'sequelize';
import Model from '../sequelize';

const Session = Model.define('Session', {
  sid: {
    type: DataType.STRING,
    primaryKey: true,
  },
  expires: DataType.DATE,
  data: DataType.STRING(50000),
  createdAt: {
    type: DataType.DATE,
  },
  updatedAt: {
    type: DataType.DATE,
  },

}, {

  freezeTableName: true,
  tableName: 'sessions',
});

export default Session;
