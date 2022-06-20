import React from 'react';
import PropTypes from 'prop-types';

import './loader.scss';

const Loader = ({ width = '100%', height = '100%', className = '' }) => (
  <span className={`rca-loader ${className}`} style={{ width, height }} />
);

Loader.propTypes = {
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Loader;
