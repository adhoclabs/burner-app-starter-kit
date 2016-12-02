import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Burner.css';

import {formatLocal} from '../../core/phone';

class Burner extends React.Component {
  render() {
    return (
      <div className={cx(s.root, this.props.className)}>
        <div className={s.name}>{this.props.name}</div>
        <div className={s.number}>{formatLocal(this.props.phoneNumber)}</div>
      </div>
    );
  }
}

export default withStyles(s)(Burner);

