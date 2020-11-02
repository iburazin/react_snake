import React, { useState, useRef, useEffect } from "react";
import { useInterval } from "./useInterval";
import { CANVAS_SIZE, SNAKE_START, APPLE_START, SCALE, SPEED, DIRECTIONS } from "./constants";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [dir, setDir] = useState([0, -1]);
  const [speed, setSpeed] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameover] = useState(false);

  //  function to start the game
  const startGame = () => {
    setSnake(SNAKE_START);
    setApple(APPLE_START);
    setDir([0, -1]);
    setSpeed(SPEED);
    setScore(0);
    setGameover(false);
  };

  // function to end the game
  const endGame = () => {
    setSpeed(null);
    setGameover(true);
  };

  // function to move the snake
  const moveSnake = ({ keyCode }) => keyCode >= 37 && keyCode <= 40 && setDir(DIRECTIONS[keyCode]);

  // function to create "apple"
  const createApple = () => apple.map((_, i) => Math.floor((Math.random() * CANVAS_SIZE[i]) / SCALE));

  // collision detection
  // function to check if we collided with the wall or the snake itself
  const checkCollision = (piece, snk = snake) => {
    if (piece[0] * SCALE >= CANVAS_SIZE[0] || piece[0] < 0 || piece[1] * SCALE >= CANVAS_SIZE[1] || piece[1] < 0) return true;

    for (const segment of snk) {
      if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
    }

    return false;
  };

  // function  to check if we collided with the apple
  const checkAppleCollision = newSnake => {
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = createApple();
      while (checkCollision(newApple, newSnake)) {
        newApple = createApple();
      }
      setApple(newApple);
      setScore(score + 1);
      return true;
    }
    return false;
  };

  const gameLoop = () => {
    const snakeCopy = JSON.parse(JSON.stringify(snake));
    const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) endGame();
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
  };

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, CANVAS_SIZE[0], CANVAS_SIZE[1]);
    context.fillStyle = "pink";
    snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
    context.fillStyle = "lightgreen";
    context.fillRect(apple[0], apple[1], 1, 1);
  }, [snake, apple, gameOver]);

  window.addEventListener("keydown", e => moveSnake(e));
  window.addEventListener("keydown", e => {
    if (e.key === " ") startGame();
  });

  useInterval(() => gameLoop(), speed);

  // onKeyDown={e => moveSnake(e)} <_ inside the div (we have to click on the div in order to 'activate' the eventListener)

  return (
    <div className="container" role="button" tabIndex="0">
      <h4>Score: {score}</h4>
      <canvas style={{ border: "1px solid black" }} ref={canvasRef} width={`${CANVAS_SIZE[0]}px`} height={`${CANVAS_SIZE[1]}px`} />
      {gameOver && <span className="centerScreen title">Game Over! Press Space To Try Again!</span>}
      <button onClick={startGame}>Start Game</button>
    </div>
  );
}

export default App;
