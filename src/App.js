import React, { Component } from 'react';


function Square(props) {
  const classNames = `square ${props.winner}`;
  return (
    <button className={classNames} onClick={props.onClick}>{props.value}</button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const { squares, winner } = this.props;
    return <Square value={squares[i]}
      onClick={() => this.props.onClick(i)}
      winner={winner && winner.includes(i) ? 'winner' : ''} />
  };
  renderBoard() {
    const rowsWidth = Array(Math.sqrt(this.props.squares.length)).fill(null);
    const celsWidth = rowsWidth;
    const board = rowsWidth.map((row, i) => {
      const squares = celsWidth.map((cel, j) => {
        const squareIndex = i * rowsWidth.length + j;
        return (
          <span key={squareIndex}>{this.renderSquare(squareIndex)}</span>
        );
      });
      return <div key={i}>{squares}</div>
    });
    return board;
  }

  render() {
    const board = this.renderBoard();
    return (
      <div>{board}</div>
    );
  }

}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          moveLocation: '',
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isReverse: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const gameSize = Math.sqrt(history[0].squares.length);
    const moveLocation = [Math.floor(i / gameSize + 1), i % gameSize + 1].join(', ');

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares,
        moveLocation
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }
  reverseSort(isReverse) {
    this.setState({
      isReverse: !isReverse,
    })
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const isReverse = this.state.isReverse;

    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move #${move} (${step.moveLocation})` :
        'Go to game start';
      
      return (
        <li key={move}>
          <button style={ move === this.state.stepNumber ? {fontWeight: 'bold'} : {fontWeight: 'normal'} } onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner is: ${winner.winnerPlayer}`;
    } else if (this.state.stepNumber === 9) {
      status = "Draw";
    } else {
      status = `Next player is: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div>
        <div className="game">
          <Board squares={current.squares}
            onClick={i => this.handleClick(i)}
            winner={winner && winner.winnerLocation} />
        </div>
        <div className="game-info">
          <p>{status}</p>
          <ol reversed={isReverse ? 'reverse' : ''}>{isReverse ? moves.reverse() : moves}</ol>
          <button onClick={() => this.reverseSort(isReverse)}>Reverse list</button>
        </div>
      </div>
    );
  }
}



function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winnerPlayer: squares[a],
        winnerLocation: [a, b, c]
      }
    }
  }
  return null;
}



export default Game;
