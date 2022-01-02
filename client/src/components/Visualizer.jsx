import React, { useState, useEffect, Fragment } from 'react';
import DFS from '../static/js/Dfs';
import BFS from '../static/js/Bfs';
import Dijkstra from '../static/js/Dijkstra';
import Node from './Node';

const Visualizer = () => {
  const [nodesArr, setNodesArr] = useState([[]]);
  const [isDragStart, setIsDragStart] = useState(false);
  const [isDragFinish, setIsDragFinish] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [currAlgo, setCurrAlgo] = useState('dfs');
  const [isKeyPressed, setKeyPressed] = useState(false);
  const [startNode, setStartNode] = useState({
    col: 0,
    row: 0,
  });
  const [finishNode, setFinishNode] = useState({
    col: 4,
    row: 4,
  });

  const createGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const newRow = [];
      for (let col = 0; col < 20; col++) {
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
    newNode.isVisited = false;
    newNode.distance = Infinity;
    newNode.previousNode = null;
    if (newNode.isStart) setStartNode(newNode);
    if (newNode.isFinish) setFinishNode(newNode);
    return newNode;
  };

  const genNewGrid = (row, col) => {
    const cloneGrid = [...nodesArr];
    const node = cloneGrid[row][col];
    if (isDragStart) {
      startNode.isStart = false;
      startNode.isWall = false;
      node.isStart = true;
      setStartNode(node);
    } else if (isDragFinish) {
      finishNode.isFinish = false;
      finishNode.isWall = false;
      node.isFinish = true;
      setFinishNode(node);
    } else node.isWall = !node.isWall;

    return cloneGrid;
  };

  const clearGrid = () => {
    setIsFinish(false);
    const newGrid = createGrid();
    resetEffects();
    setNodesArr(newGrid);
  };

  const resetEffects = () => {
    for (const row of nodesArr) {
      for (const col of row) {
        let node = document.getElementById(`${col.row}-${col.col}`);
        if (
          node.className === 'node shortestPath' ||
          node.className === 'node visited'
        ) {
          node.className = 'node';
        }
      }
    }
  };

  const onMouseDown = (row, col) => {
    if (!isFinish) {
      setKeyPressed(true);
      if (nodesArr[row][col] === startNode) setIsDragStart(true);
      else if (nodesArr[row][col] === finishNode) setIsDragFinish(true);
      const newGrid = genNewGrid(row, col);
      setNodesArr(newGrid);
    }
  };

  const onMouseEnter = (row, col) => {
    if (isKeyPressed && !isFinish) {
      const newGrid = genNewGrid(row, col);
      setNodesArr(newGrid);
    }
  };

  const onMouseUp = () => {
    setIsDragStart(false);
    setIsDragFinish(false);
    setKeyPressed(false);
  };

  const algoOnChange = (e) => {
    setCurrAlgo(e.target.value);
    clearGrid();
  };

  const checkGrid = () => {
    for (const row of nodesArr) {
      for (const col of row) {
        let node = document.getElementById(`${col.row}-${col.col}`);
        if (node.className === 'node shortestPath') return false;
      }
    }
    return true;
  };

  const visualise = () => {
    if (checkGrid()) {
      setIsFinish(true);
      setIsRunning(true);
      let visitedNodes;
      switch (currAlgo) {
        case 'dfs':
          visitedNodes = DFS(nodesArr, startNode, finishNode);
          break;
        case 'bfs':
          visitedNodes = BFS(nodesArr, startNode, finishNode);
          break;
        case 'dij':
          visitedNodes = Dijkstra(nodesArr, startNode, finishNode);
          break;
        default:
          break;
      }

      const smallestPath = getShortestPath(finishNode);
      visualiseGrid(visitedNodes, smallestPath);
    }
  };

  const getShortestPath = (finish) => {
    const ShortestPathOrder = [];
    let currentNode = finish;
    while (currentNode !== null) {
      ShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return ShortestPathOrder;
  };

  const visualiseGrid = (visitedNodes, smallestPath) => {
    for (let i = 0; i <= visitedNodes.length; i++) {
      if (i === visitedNodes.length) {
        setTimeout(() => {
          visualisePath(smallestPath);
        }, 50 * i);
      } else {
        setTimeout(() => {
          const currentNode = visitedNodes[i];
          if (!(currentNode === startNode || currentNode === finishNode)) {
            const node = document.getElementById(
              `${currentNode.row}-${currentNode.col}`
            );
            node.className = 'node visited';
          }
        }, 50 * i);
      }
    }
  };

  const visualisePath = (smallestPath) => {
    for (let i = 0; i < smallestPath.length; i++) {
      const currentNode = smallestPath[i];
      setTimeout(() => {
        if (i === smallestPath.length - 1) setIsRunning(false);
        if (!(currentNode === startNode || currentNode === finishNode)) {
          const node = document.getElementById(
            `${currentNode.row}-${currentNode.col}`
          );
          node.className = 'node shortestPath';
        }
      }, 50 * i);
    }
  };

  useEffect(() => {
    clearGrid();
    // eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <div className='containerAll'>
        <h1>Welcome To The PathFinder Viusalizer</h1>
        <div className='menuContainer'>
          <div className='selectAlgo'>
            <label className='algoText' htmlFor='algos'>
              Algorithms
            </label>
            <select
              className='select'
              name='algos'
              id='algos'
              onChange={algoOnChange}
            >
              <option value='dfs'>Depth-First Search</option>
              <option value='bfs'>Breadth-first Search</option>
              <option value='dij'>Dijkstra</option>
            </select>
          </div>
          <button className='btn' onClick={visualise} disabled={isRunning}>
            Visualise Algorithm
          </button>
          <button className='btn' onClick={clearGrid} disabled={isRunning}>
            Clear Grid
          </button>
        </div>
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
      </div>
    </Fragment>
  );
};

export default Visualizer;
