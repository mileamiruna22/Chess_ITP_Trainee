import React from 'react';
import './styleComponents/Square.css';

function Square({ color, highlighted, selected, check, onClick, coordinates = {}, showCoordinates, children }) {
  
  const { row = 0, col = 0 } = coordinates || {};
  
  
  const fileLabel = String.fromCharCode(97 + col); // a, b, c, ...
  const rankLabel = 8 - row; // 8, 7, 6, ...
  
  
  const squareClass = `square ${color}${highlighted ? ' highlighted' : ''}${selected ? ' selected' : ''}${check ? ' check' : ''}`;
  
  return (
    <div className={squareClass} onClick={onClick}>
      {showCoordinates && (row === 7 || col === 0) && (
        <div className={`square-coordinates top-left`}>
          {row === 7 && col === 0 && `${fileLabel}${rankLabel}`}
          {row === 7 && col !== 0 && `${fileLabel}`}
          {row !== 7 && col === 0 && `${rankLabel}`}
        </div>
      )}
      {children}
    </div>
  );
}

export default Square;