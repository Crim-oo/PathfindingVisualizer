import React from 'react';
import '../static/css/Node.css';

const Node = (props) => {
  const newProperty = props.isStart
    ? 'start'
    : props.isFinish
    ? 'finish'
    : props.isWall
    ? 'wall'
    : '';

  return (
    <div
      id={`${props.row}-${props.col}`}
      className={`node ${newProperty}`}
      onMouseUp={() => props.onMouseUp()}
      onMouseEnter={() => props.onMouseEnter(props.row, props.col)}
      onMouseDown={() => props.onMouseDown(props.row, props.col)}
    ></div>
  );
};

export default Node;
