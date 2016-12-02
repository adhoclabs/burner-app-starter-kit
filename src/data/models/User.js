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
import { encrypt } from '../../core/encryption';
import Burner from './Burner';

const User = Model.define('User', {

  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  token: {
    type: DataType.STRING,
    required: true,
  },
  createdAt: {
    type: DataType.DATE,
  },
  updatedAt: {
    type: DataType.DATE,
  },

}, {

  indexes: [
    { fields: ['token'] },
  ],

  classMethods: {
    /**
     * Find or create a user by an (encrypted) authorization token.
     *
     * @param {String} token - The unencrypted authorization token.
     */
    findOrCreateByToken: function findOrCreateByToken(token) {
      const encryptedToken = encrypt(token);

      return new Promise((resolve, reject) => {
        this
          .findOrCreate({ where: { token: encryptedToken } })
          .spread((user) => {
            resolve(user);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },

});

// Associations
User.hasMany(Burner, {foreignKey: 'userId'});

export default User;
