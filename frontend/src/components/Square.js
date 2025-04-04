import React from 'react';
import '../components/styleComponents/Square.css';

function Square({ color, children }) {
  return <div className={`square ${color}`}>{children}</div>;
}

export default Square;