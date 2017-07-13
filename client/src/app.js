import React from 'react';
import ReactDOM from 'react-dom';
import PaintingContainer from './containers/PaintingContainer'

window.addEventListener('load', function () {
  ReactDOM.render(
    <PaintingContainer/>,
    document.getElementById('app')
  );
});
