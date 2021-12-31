import React, { useState, useEffect } from 'react';
import Node from './Node';

const Visualizer = () => {
  const [nodesArr, setNodesArr] = useState([[]]);
  const [isKeyPressed, setKeyPressed] = useState(false);
  const [startNode, setStartNode] = useState({ row: 5, col: 5 });
  const [finishNode, setFinishNode] = useState({ row: 5, col: 10 });

  const createGrid = () => {
    const grid = [];
    for (let row = 0; row < 30; row++) {
      const newRow = [];
      for (let col = 0; col < 50; col++) {
        newRow.push(createNode(row, col));
      }
      grid.push(newRow);
    }
    return grid;
  };

  const createNode = (row, col) => {
    const newNode = {};
    newNode.row = row;
    newNode.col = col;
    newNode.isStart = startNode.row === row && startNode.col === col;
    newNode.isFinish = finishNode.row === row && finishNode.col === col;
    newNode.isWall = false;
    return newNode;
  };

  const genNewGrid = (row, col) => {
    const cloneGrid = [...nodesArr];
    const node = cloneGrid[row][col];
    node.isWall = !node.isWall;
    return cloneGrid;
  };

  const onMouseDown = (row, col) => {
    const newGrid = genNewGrid(row, col);
    setNodesArr(newGrid);
    setKeyPressed(true);
  };

  const onMouseEnter = (row, col) => {
    if (isKeyPressed) {
      const newGrid = genNewGrid(row, col);
      setNodesArr(newGrid);
    }
  };

  const onMouseUp = () => {
    setKeyPressed(false);
  };

  useEffect(() => {
    const newGrid = createGrid();
    setNodesArr(newGrid);
  }, []);

  return (
    <div className='gridContainer'>
      {nodesArr.map((nodeRow) =>
        nodeRow.map((node, idx) => {
          return (
            <Node
              key={idx}
              row={node.row}
              col={node.col}
              isStart={node.isStart}
              isFinish={node.isFinish}
              isWall={node.isWall}
              onMouseUp={onMouseUp}
              onMouseDown={onMouseDown}
              onMouseEnter={onMouseEnter}
            />
          );
        })
      )}
    </div>
  );
};

export default Visualizer;
