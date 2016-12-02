import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Burner.css';

class Burner extends React.Component {
  render() {
    return (
      <div className={cx(s.root, this.props.className)}>
        <span className={s.burnerName}>{this.props.name}</span>
      </div>
    );
  }
}

export default withStyles(s)(Burner);

