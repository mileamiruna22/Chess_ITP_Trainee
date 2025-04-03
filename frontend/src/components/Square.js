import React from 'react';
import '../components/styleComponents/Square.css';

function Square({ color }) {
  return <div className={`square ${color}`}></div>;
}

export default Square;