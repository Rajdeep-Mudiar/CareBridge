import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => (
  <div className="spinner-container">
    <div className="spinner"></div>
    <div className="loading-text">Loading, please wait...</div>
  </div>
);

export default LoadingSpinner;
