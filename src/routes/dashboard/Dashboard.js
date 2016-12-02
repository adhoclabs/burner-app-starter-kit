/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../components/Layout';
import Burner from '../../components/Burner';
import s from './Dashboard.css';

class Dashboard extends React.Component {
  renderBurners(burners, loading) {
    if (loading) {
      return (
        <span className={s.loading}>Loading...</span>
      )
    }

    return (
      <div className={s.burners}>
        {this.props.burners.map( ( burner, index ) => (
          <Burner key={index} name={burner.name}/>
        ))}
      </div>
    )
  }

  render() {
    return (
      <Layout>
        <div className={s.root}>
          <div className={s.container}>
            <h1>Your Burners</h1>
              {this.renderBurners(this.props.burners, this.props.loading)}
          </div>
        </div>
      </Layout>
    );
  }
}

export default withStyles(s)(Dashboard);
