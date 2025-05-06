import React from 'react';
import './styleComponents/Square.css';

function Square({ color, highlighted, selected, check, onClick, coordinates = {}, showCoordinates, children }) {
  // Adăugăm o valoare implicită pentru coordinates și folosim destructuring cu valori implicite
  const { row = 0, col = 0 } = coordinates || {};
  
  // Convertim coordonatele în notație șah (a1, b2, etc.)
  const fileLabel = String.fromCharCode(97 + col); // a, b, c, ...
  const rankLabel = 8 - row; // 8, 7, 6, ...
  
  // Construim clasa CSS în funcție de proprietăți
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