import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import loading from './loading.gif';
// let defl = 0;
// let defH = 0;
// let attH = 0;
// let attl = 0;
let fullRows = [];
let showLoad = 1;
let globalInfo ="";
let need = [];
let trait0 = [];
let trait1 = [];
let trait2 = [];
let trait3 = [];
let trait4 = [];

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            player1: 1,
            player2: 2,
            currentPlayer: null,
            board: [],
            gameOver: false,
            message: '',
            apiResponse: null,
            url: props.completedUrl,
            ran: false
        };

        // Bind play function to App component
        this.play = this.play.bind(this);
        //console.log("1"); //3: only on start
    }
    callAPI() {
        fetch(this.state.url.newUrl)
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res}))
            .then(res => this.setState({ran: true}))
            .catch(err => err);
    }

    componentDidMount() {
        this.callAPI();

    }


    // Starts new game
    initBoard() {
        // Create a blank 6x7 matrix
        //console.log("2"); //5: only on start
        let board = [];
        for (let r = 0; r < 6; r++) {
            let row = [];
            for (let c = 0; c < 7; c++) {
                row.push(null)
            }
            board.push(row);
            //console.log("3");//6: runs 6 times 1 for each row
        }
        //console.log("4"); //7: only on start
        this.setState({
            board,
            currentPlayer: this.state.player1,
            gameOver: false,
            message: ''
        });
    }

    togglePlayer() {
        //console.log("5");
        return (this.state.currentPlayer === this.state.player1) ? this.state.player2 : this.state.player1;
    }

    play(c) {

        //console.log("6"); //1: each move. c is colloumn placed 0-6
        if (!this.state.gameOver) {
            // Place piece on board
            //console.log("7");
            let board = this.state.board;

            for (let r = 5; r >= 0; r--) {
                //console.log(board);
                //board is an array of 6 arrays each array has 7 elements
                // 5 is bottom 0 is top
                //for red piece the array is 1 yellow its 2
                //in the correct location
                //ex: bottom middle for red is
                //board[5] = array[null,null,null,1,null,null,null]
                if (!board[r][c]) {
                    board[r][c] = this.state.player1;
                    //console.log("8");
                    break;
                }
                //console.log("9"); //row # for placement
                //if its second row this runs once
                //3rd row this runs twice etc etc
            }

            // Check status of board
            let result = this.checkAll(board);
            if (result === this.state.player1) {
                //console.log("10"); //for red wins
                this.setState({board, gameOver: true, message: 'Player 1 (red) wins!'});
            } else if (result === this.state.player2) {
                //console.log("11"); //for yellow wins
                this.setState({board, gameOver: true, message: 'Player 2 (yellow) wins!'});
            } else if (result === 'draw') {
                //console.log("12"); //for draw game
                this.setState({board, gameOver: true, message: 'Draw game.'});
            } else {
                //console.log("13"); //toggles to next player
                this.setState({board, currentPlayer: this.togglePlayer()});
                this.ai(board);
            }
        } else {
            //console.log("14"); //only if click after game is over
            this.setState({message: 'Game over. Please start a new game.'});
        }
        //console.log("end play");
    }
    aiEasy(board){
        let count = 0;
        let aiRow = Math.floor(Math.random() * 6);
        for (var r = 0; r < 6; r++) {
            if (board[r][aiRow]) {
                count++;
            }
        }
        if (count !== 6) {
            board[5 - count][aiRow] = this.state.player2;
            return board;
        } else this.aiEasy(board);


    }
    topCheck(board, row){
        let count = 0;
        for (var r = 0; r < 6; r++) {
            if (board[r][row]) {
                count++;
            }
        }
        if (count !== 6) {
            return true;
        } else {
            fullRows.push(row);
            return false;
        }


    }
    aiDefend(board){
        if(!this.state.gameOver) {
            let count = 0;
            for (let r = 5; r > 0; r--) {
                for (let c = 0; c < 7; c++) {
                    if (fullRows.includes(c)) {
                        c++;
                    }
                    if (board[r][c] !== null && board[r][c + 1] !== null && board[r][c + 2] !== null) {
                        if (board[r][c] === 1 && board[r][c + 1] === 1 && board[r][c + 2] === 1) {
                            //horizontal
                            // console.log("caught horizontal");
                            // console.log("r: " + r + " c: " + c);
                            if (r !== 5 && c < 4 ) {
                                if (board[r][c + 3] === null && board[r + 1][c + 3] !== null && this.topCheck(board, c + 3)) {
                                    //console.log("smart");
                                    board[r][c + 3] = this.state.player2;
                                    this.checkBelow(board, r, c);
                                    console.log("1111111");
                                    console.log(board);
                                    return board;
                                } else if (board[r][c - 1] === null && board[r + 1][c - 1] !== null && this.topCheck(board, c -1)) {
                                    //console.log("smart");
                                    board[r][c - 1] = this.state.player2;
                                    this.checkBelow(board, r, c);
                                    console.log("1111111");
                                    console.log(board);
                                    return board;
                                    count--;
                                }
                            } else {
                                if (board[r][c + 3] === null && this.topCheck(board, c + 3)) {
                                    // console.log("smart");
                                    board[r][c + 3] = this.state.player2;
                                    this.checkBelow(board, r, c);
                                    console.log("1111111");
                                    console.log(board);
                                    return board;
                                    count--;
                                    break;
                                } else if (board[r][c - 1] === null && this.topCheck(board, c - 1)) {
                                    // console.log("smart");
                                    board[r][c - 1] = this.state.player2;
                                    this.checkBelow(board, r, c);
                                    console.log("1111111");
                                    console.log(board);
                                    return board;
                                    count--;
                                    break;
                                }
                            }
                        }
                    }
                    if(c - 3 >= 0 && r - 3 >= 0) {
                        if (board[r][c] !== null && board[r - 1][c] !== null && board[r - 2][c] !== null && this.topCheck(board, c - 3)) {
                            //console.log("vert");
                            if (board[r][c] === 1 && board[r - 1][c] === 1 && board[r - 2][c] === 1 && this.topCheck(board, c - 3)) {
                                //vertical
                                // console.log("caught vertical");
                                // console.log("r: " + r + " c: " + c);
                                if (board[r - 3][c] === null && (r - 3) >= 0 && this.topCheck(board, c)) {
                                    board[r - 3][c] = this.state.player2;
                                    this.checkBelow(board, r, c);
                                    console.log("1111111");
                                    console.log(board);
                                    count--;
                                    return board;

                                    break;
                                }
                            }
                        }
                    }
                    if(r + 4 <= 6 && c + 3 <= 6) {
                        if (board[r][c] !== null && board[r + 1][c + 1] !== null && board[r + 2][c + 2] !== null) {
                            //console.log("dright");
                            if (1 === board[r][c] && 1 === board[r + 1][c + 1] &&
                                1 === board[r + 2][c + 2]) {
                                //diagonal right
                                // console.log("caught d right");
                                // console.log("r: " + r + " c: " + c);
                                if (r + 3 <= 5 && c + 3 <= 6) {
                                    if (this.topCheck(board,c+3) && board[r + 3][c + 3] === null && (board[r + 3][c + 3] !== null || r === 2) ) {
                                        board[r + 3][c + 3] = this.state.player2;
                                        this.checkBelow(board, r, c);
                                        console.log("1111111");
                                        console.log(board);
                                        return board;
                                        count--;
                                        break;
                                    }
                                } else if (c !== 0 && this.topCheck(board, c - 1)) {
                                    if (board[r - 1][c - 1] === null && board[r][c - 1] !== null) {
                                        board[r - 1][c - 1] = this.state.player2;
                                        this.checkBelow(board, r, c);
                                        console.log("1111111");
                                        console.log(board);
                                        return board;
                                        count--;
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    if(r + 3 <= 5 && c + 3 <= 6){

                        if(board[r][c] !== null && board[r+1][c+1] !== null && board[r+2][c+2] === null && board[r+3][c+3] !== null && board[r+3][c+2] !== null && this.topCheck(board,c + 2)){
                            if(board[r][c] === 1 && board[r+1][c+1] === 1  && board[r+3][c+3] === 1){

                                board[r+2][c+2] = this.state.player2;
                                return board;
                                break;
                            }
                        }
                    }
                    if(r-3 >= 0 && c+2 <= 6 && c-3 >= 0) {
                        if (board[r][c] !== null && board[r - 1][c + 1] !== null && board[r - 2][c + 2] !== null) {
                            // console.log("dleft");
                            if (1 === board[r][c] && 1 === board[r - 1][c + 1] &&
                                1 === board[r - 2][c + 2]) {
                                //diagonal left
                                // console.log("caught d left");
                                // console.log("r: " + r + " c: " + c);
                                if (r - 3 >= 0 && c - 3 >= 0 && this.topCheck(board, c - 3)) {
                                    if (board[r - 3][c - 3] === null && board[r - 2][c - 3] !== null) {
                                        board[r - 3][c - 3] = this.state.player2;
                                        this.checkBelow(board, r, c);
                                        console.log("1111111");
                                        console.log(board);
                                        return board;
                                        count--;
                                        break;
                                    }
                                } else if (r + 2 <= 5 && c + 1 <= 6 && this.topCheck(board, c + 1)) {
                                    if (board[r + 1][c + 1] === null && board[r + 2][c + 1] !== null) {
                                        board[r + 1][c + 1] = this.state.player2;
                                        this.checkBelow(board, r, c);
                                        console.log("1111111");
                                        console.log(board);
                                        return board;
                                        count--;
                                        break;
                                    }
                                }
                            }
                        }
                    }


                    if(c+3 <=6) {
                        if (board[r][c] !== null && board[r][c + 1] === null && board[r][c + 2] !== null && board[r][c + 3] !== null) {
                            if(r !== 5){
                                if(board[r][c] === 1 && board[r][c+2] === 1 && board[r][c+3] === 1 && board[r+1][c+1] !== null && this.topCheck(board, c + 1)){
                                    board[r][c+1] = this.state.player2;

                                    return board;
                                    break;
                                }
                            }else if(board[r][c] === 1 && board[r][c+2] === 1 && board[r][c+3] === 1 && r === 5 && this.topCheck(board, c + 1)){
                                board[r][c+1] = this.state.player2;

                                return board;
                                break;
                            }
                        }
                    }
                    if(c+3 <=6) {
                        if (board[r][c] !== null && board[r][c + 1] !== null && board[r][c + 2] === null && board[r][c + 3] !== null) {
                            if(r !== 5){
                                if(board[r][c] === 1 && board[r][c+2] === null && board[r][c+3] === 1 && board[r][c+1] === 1 && board[r+1][c+2] !== null && this.topCheck(board, c + 2)){
                                    board[r][c+2] = this.state.player2;

                                    return board;
                                    break;
                                }
                            }else if(board[r][c] === 1 && board[r][c+1] === 1 && board[r][c+3] === 1 && r === 5 && this.topCheck(board, c + 2)){
                                board[r][c+2] = this.state.player2;

                                return board;
                                break;
                            }
                        }
                    }

                    if (board[r][c] !== null && board[r][c + 1] !== null && board[r][c + 2] === null && board[r][c + 3] !== null) {
                        // console.log("middle right gap");
                        // console.log("r: " + r + " c: " + c);
                        if (r !== 5 && c + 3 <= 6 && this.topCheck(board, c + 2)) {
                            if (board[r][c] === 1 && board[r][c + 1] === 1 && board[r - 1][c + 2] !== null && board[r][c + 3] === 1) {
                                board[r][c + 2] = this.state.player2;
                                this.checkBelow(board, r, c);
                                console.log("1111111");
                                console.log(board);
                                return board;
                                break;
                            }
                        } else if (r === 5 && c + 3 <= 6 && this.topCheck(board, c + 2)) {
                            if (board[r][c] === 1 && board[r][c + 1] === 1 && board[r][c + 3] === 1) {
                                board[r][c + 2] = this.state.player2;
                                this.checkBelow(board, r, c);
                                console.log("1111111");
                                console.log(board);
                                return board;
                                break;
                            }
                        }
                    }
                    if (board[r][c] !== null && board[r][c + 1] === null && board[r][c + 2] !== null && board[r][c + 3] !== null) {
                        // console.log("middle left gap");
                        // console.log("r: " + r + " c: " + c);
                        if (r !== 5 && c + 3 <= 6 && this.topCheck(board, c + 1)) {
                            if (board[r][c] === 1 && board[r][c + 1] === null && board[r - 1][c + 1] !== null && board[r][c + 3] === 1) {
                                board[r][c + 1] = this.state.player2;
                                this.checkBelow(board, r, c);
                                console.log("1111111");
                                console.log(board);
                                return board;
                                break;
                            }
                        } else if (r === 5 && c + 3 <= 6 && this.topCheck(board, c + 1)) {
                            if (board[r][c] === 1 && board[r][c + 1] === null && board[r][c + 3] === 1) {
                                board[r][c + 1] = this.state.player2;
                                this.checkBelow(board, r, c);
                                console.log("1111111");
                                console.log(board);
                                return board;
                                break;
                            }
                        }
                    }
                    if (board[r][c] !== null && board[r][c + 1] === null && board[r][c + 2] !== null && board[r][c + 3] !== null) {
                        if (c + 3 <= 6) {
                            if (board[r][c] === 1 && board[r][c + 1] === null && board[r][c + 2] === 1 && board[r][c + 3] === 1 && this.topCheck(board, c + 1) && board[r+1][c+1] !== null) {
                                board[r][c + 1] = this.state.player2;
                                this.checkBelow(board, r, c);
                                console.log("1111111");
                                console.log(board);
                                return board;
                                break;
                            }
                        }
                    }
                    if (board[r][c] !== null && board[r][c + 1] !== null && board[r][c - 1] === null && board[r][c + 2] === null) {
                        if (c + 2 <= 6 && c - 1 >= 0 && r + 2 <= 5) {
                            if (board[r][c] === 1 && board[r][c + 1] === 1 && board[r][c + 2] === null && board[r][c - 1] === null && r === 5 && this.topCheck(board, c + 2)) {
                                board[r][c + 2] = this.state.player2;
                                this.checkBelow(board, r, c);
                                console.log("1111111");
                                console.log(board);
                                return board;
                                break;
                            } else if (board[r][c] === 1 && board[r][c + 1] === 1 && board[r][c + 2] === null && board[r][c - 1] === null && board[r + 1][c + 2] !== null && board[r + 2][c - 1] !== null && this.topCheck(board, c+ 2)) {
                                board[r][c + 2] = this.state.player2;
                                this.checkBelow(board, r, c);
                                console.log("1111111");
                                console.log(board);
                                return board;
                                break;
                            }
                        }
                    }
                    if (c + 3 <= 6 && r - 3 >= 0) {
                        if (board[r][c] !== null && board[r - 1][c + 1] !== null && board[r - 2][c + 2] === null && board[r - 3][c + 3] !== null && board[r - 1][c + 2] !== null && this.topCheck(board, c + 2)) {
                            if (r - 3 >= 0 && c + 3 <= 6) {
                                if (board[r][c] === 1 && board[r - 1][c + 1] === 1 && board[r - 2][c + 2] === null && board[r - 3][c + 3] === 1) {
                                    board[r - 2][c + 2] = this.state.player2;
                                    this.checkBelow(board, r, c);
                                    console.log("1111111");
                                    console.log(board);
                                    return board;
                                    break;
                                }
                            }
                        }
                    }
                    if(r - 3 >= 0 && c + 3 >= 0) {
                        if (board[r][c] !== null && board[r - 1][c + 1] === null && board[r - 2][c + 2] !== null && board[r - 3][c + 3] !== null) {
                            if (board[r][c] === 1 && board[r][c + 1] !== null && board[r - 2][c + 2] === 1 && board[r - 3][c + 3] === 1 && this.topCheck(board, c + 1)) {
                                board[r - 1][c + 1] = this.state.player2;

                                return board;
                                break;
                            }
                        }
                    }
                    if(r - 3 >= 0 && c + 3 >= 0) {
                        if (board[r][c] !== null && board[r - 1][c + 1] !== null && board[r - 2][c + 2] === null && board[r - 3][c + 3] !== null) {
                            if (board[r][c] === 1 && board[r-1][c + 2] !== null && board[r - 1][c + 1] === 1 && board[r - 3][c + 3] === 1 && this.topCheck(board, c + 2)) {
                                board[r - 2][c + 2] = this.state.player2;

                                return board;
                                break;
                            }
                        }
                    }



                    if(r + 3 <= 5 && c + 3 <= 6) {
                        if (board[r][c] !== null && board[r + 1][c + 1] !== null && board[r + 2][c + 2] === null && board[r + 3][c + 3] !== null && this.topCheck(board, c + 2)) {
                            if (board[r][c] === 1 && board[r + 1][c + 1] === 1 && board[r + 3][c + 2] !== null && board[r + 3][c + 3] === 1) {
                                board[r + 2][c + 2] = this.state.player2;

                                return board;
                                break;
                            }
                        }
                    }
                    if(r + 3 <= 5 && c + 3 <= 6) {
                        if (board[r][c] !== null && board[r+1][c+1] === null && board[r+2][c+2] !== null && board[r+3][c+3] !== null && this.topCheck(board, c + 1)){
                            if(board[r][c] === 1 && board[r+2][c+1] !== null && board[r+2][c+2] === 1 && board[r+3][c+3] === 1){
                                board[r+1][c+1] = this.state.player2;

                                return board;
                                break;
                            }

                        }
                    }
                    if(r+2 <= 5 && c+ 2 <= 6 && r-1 >= 0 && c-1 >= 0){
                        if(board[r][c] !== null && board[r+1][c+1] !== null && board[r+2][c+2] !== null && this.topCheck(board,c-1)){
                            if(board[r][c] === 1 && board[r+1][c+1] === 1 && board[r+2][c+2] === 1 && board[r-1][c-1] === null && board[r][c-1] !== null){
                                board[r-1][c-1] = this.state.player2;

                                return board;
                                break;
                            }
                        }
                    }
                    if(c+3 <= 6 && c-1 >= 0) {
                        if (board[r][c] !== null && board[r][c + 1] === null && board[r][c + 2] !== null && board[r][c - 1] === null && board[r][c + 3] === null && this.topCheck(board, c + 1)) {
                            if (r !== 5) {
                                if (board[r][c] === 1 && board[r][c + 2] === 1 && board[r + 1][c + 1] !== null) {
                                    board[r][c + 1] = this.state.player2;

                                    return board;
                                    break;
                                }
                            } else if (r === 5) {
                                if (board[r][c] === 1 && board[r][c + 2] === 1) {
                                    board[r][c + 1] = this.state.player2;

                                    return board;
                                    break;
                                }
                            }

                        }
                    }
                    if(c + 2 <= 6 && r + 1 <= 5 && c-1 >= 0) {
                        if (board[r][c] !== null && board[r][c + 1] !== null && board[r][c - 1] === null && board[r][c + 2] === null && this.topCheck(board, c -1)) {
                            if (board[r][c] === 1 && board[r][c + 1] === 1 && board[r + 1][c - 1] !== null) {

                                board[r][c - 1] = this.state.player2;
                                return board;
                                break;
                            }
                        }
                    }else if(r === 5 && board[r][c] === 1 && board[r][c+1] === 1 && board[r][c-1] === null && board[r][c+2] === null && this.topCheck(board,c - 1)){
                        board[r][c-1] = this.state.player2;

                        return board;
                        break;
                    }

                }
                count++;
            }
            // console.log(count);
            // console.log(board);
            if (count !== 5) {
                console.log("smart move no return");
            } else {
                //board = this.aiEasy(board);
                return [0,0];
            }
        }
    }
    aiAttack(board){
        if(!this.state.gameOver) {
            let count = 0;
            for (let r = 5; r > 0; r--) {
                for (let c = 0; c < 7; c++) {
                    if (fullRows.includes(c)) {
                        c++;
                    }
                    if (board[r][c] !== null && board[r][c + 1] !== null && board[r][c + 2] !== null) {
                        if (board[r][c] === 2 && board[r][c + 1] === 2 && board[r][c + 2] === 2) {
                            //horizontal
                            // console.log("caught horizontal");
                            // console.log("r: " + r + " c: " + c);
                            if (r !== 5 && c < 4) {
                                if (board[r][c + 3] === null && board[r + 1][c + 3] !== null && this.topCheck(board, c + 3)) {
                                    board[r][c + 3] = this.state.player2;
                                    this.checkBelow(board, r, c);
                                    console.log("1111111");
                                    console.log(board);
                                    return board;
                                    count--;
                                    break;
                                } else if (board[r][c - 1] === null && board[r + 1][c - 1] !== null && this.topCheck(board, c -1)) {
                                    board[r][c - 1] = this.state.player2;
                                    this.checkBelow(board, r, c);
                                    console.log("1111111");
                                    console.log(board);
                                    return board;
                                    count--;
                                    break;
                                }
                            } else {
                                if (board[r][c + 3] === null && this.topCheck(board, c + 3)) {
                                    board[r][c + 3] = this.state.player2;
                                    this.checkBelow(board, r, c);
                                    console.log("1111111");
                                    console.log(board);
                                    return board;
                                    count--;
                                    break;
                                } else if (board[r][c - 1] === null && this.topCheck(board, c-1)) {
                                    board[r][c - 1] = this.state.player2;
                                    this.checkBelow(board, r, c);
                                    console.log("1111111");
                                    console.log(board);
                                    return board;
                                    count--;
                                    break;
                                }
                            }
                        }
                    }
                    if (r - 3 >= 0) {
                        if (board[r][c] !== null && board[r - 1][c] !== null && board[r - 2][c] !== null) {
                            //console.log("vert");
                            if (board[r][c] === 2 && board[r - 1][c] === 2 && board[r - 2][c] === 2) {
                                //vertical
                                // console.log("caught vertical");
                                // console.log("r: " + r + " c: " + c);
                                if (board[r - 3][c] === null && (r - 3) >= 0 && this.topCheck(board, c)) {
                                    board[r - 3][c] = this.state.player2;
                                    this.checkBelow(board, r, c);
                                    console.log("1111111");
                                    console.log(board);
                                    return board;
                                    count--;
                                    break;
                                }
                            }
                        }
                    }
                    if (r - 2 >= 0 && c + 2 <= 6) {
                        if (board[r][c] !== null && board[r - 1][c + 1] !== null && board[r - 2][c + 2] !== null) {
                            //console.log("dright");
                            if (1 === board[r][c] && 1 === board[r - 1][c + 1] &&
                                1 === board[r - 2][c + 2]) {
                                //diagonal right
                                // console.log("caught d right");
                                // console.log("r: " + r + " c: " + c);
                                if (r - 3 >= 0 && this.topCheck(board, c + 3)) {
                                    if (board[r - 3][c + 3] === null && board[r - 2][c + 3] !== null) {
                                        board[r - 3][c + 3] = this.state.player2;
                                        this.checkBelow(board, r, c);
                                        console.log("1111111");
                                        console.log(board);
                                        return board;
                                        count--;
                                        break;
                                    }
                                } else if (c !== 0 && this.topCheck(board, c - 1)) {
                                    if (board[r + 1][c - 1] === null && board[r + 2][c - 1] !== null) {
                                        board[r + 1][c - 1] = this.state.player2;
                                        this.checkBelow(board, r, c);
                                        console.log("1111111");
                                        console.log(board);
                                        return board;
                                        count--;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    if (r - 3 >= 0 && c + 2 <= 6 && c - 3 >= 0 && r + 1 <= 5) {
                        if (board[r][c] !== null && board[r - 1][c + 1] !== null && board[r - 2][c + 2] !== null) {
                            //console.log("dleft");
                            if (1 === board[r][c] && 1 === board[r - 1][c + 1] &&
                                1 === board[r - 2][c + 2]) {
                                //diagonal left
                                // console.log("caught d left");
                                // console.log("r: " + r + " c: " + c);
                                if (r - 3 >= 0 && c - 3 >= 0 && this.topCheck(board, c - 3)) {
                                    if (board[r - 3][c - 3] === null && board[r - 2][c - 3] !== null) {
                                        board[r - 3][c - 3] = this.state.player2;
                                        this.checkBelow(board, r, c);
                                        console.log("1111111");
                                        console.log(board);
                                        return board;
                                        count--;
                                        break;
                                    }
                                } else if (r + 2 <= 5 && c + 1 <= 6 && this.topCheck(board, c + 1)) {
                                    if (board[r + 1][c + 1] === null && board[r + 2][c + 1] !== null) {
                                        board[r + 1][c + 1] = this.state.player2;
                                        this.checkBelow(board, r, c);
                                        console.log("1111111");
                                        console.log(board);
                                        return board;
                                        count--;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    if (board[r][c] !== null && board[r][c + 1] !== null && board[r][c + 2] === null && board[r][c + 3] !== null) {
                        // console.log("middle right gap");
                        // console.log("r: " + r + " c: " + c);
                        if (r !== 5 && c + 3 <= 6  && this.topCheck(board, c + 2)) {
                            if (board[r][c] === 2 && board[r][c + 1] === 2 && board[r - 1][c + 2] !== null && board[r][c + 3] === 2) {
                                board[r][c + 2] = this.state.player2;
                                this.checkBelow(board, r, c);
                                console.log("1111111");
                                console.log(board);
                                return board;
                                break;
                            }
                        } else if (r === 5 && c + 3 <= 6  && this.topCheck(board, c + 2)) {
                            if (board[r][c] === 2 && board[r][c + 1] === 2 && board[r][c + 3] === 2) {
                                board[r][c + 2] = this.state.player2;
                                this.checkBelow(board, r, c);
                                console.log("1111111");
                                console.log(board);
                                return board;
                                break;
                            }
                        }
                    }
                    if (board[r][c] !== null && board[r][c + 1] === null && board[r][c + 2] !== null && board[r][c + 3] !== null) {
                        // console.log("middle left gap");
                        // console.log("r: " + r + " c: " + c);
                        if (r !== 5 && c + 3 <= 6  && this.topCheck(board, c + 1)) {
                            if (board[r][c] === 2 && board[r][c + 1] === null && board[r - 1][c + 1] !== null && board[r][c + 3] === 2) {
                                board[r][c + 1] = this.state.player2;
                                this.checkBelow(board, r, c);
                                console.log("1111111");
                                console.log(board);
                                return board;
                                break;
                            }
                        } else if (r === 5 && c + 3 <= 6  && this.topCheck(board, c + 1)) {
                            if (board[r][c] === 2 && board[r][c + 1] === null && board[r][c + 3] === 2) {
                                board[r][c + 1] = this.state.player2;
                                this.checkBelow(board, r, c);
                                console.log("1111111");
                                console.log(board);
                                return board;
                                break;
                            }
                        }
                    }
                    if(board[r][c] === 2 && board[r][c+1] === 2 && board[r][c-1] === null && board[r][c+2] === null && r === 5 && (board[r][c-2] === null || board[r][c+3] === null)){
                        board[r][c-1] = this.state.player2;
                        return board;
                        break;
                    }
                    if(r - 3 >= 0 && c + 3 >= 0) {
                        if (board[r][c] !== null && board[r - 1][c + 1] === null && board[r - 2][c + 2] !== null && board[r - 3][c + 3] !== null) {
                            if (board[r][c] === 2 && board[r][c + 1] !== null && board[r - 2][c + 2] === 2 && board[r - 3][c + 3] === 2 && this.topCheck(board, c + 1)) {
                                board[r - 1][c + 1] = this.state.player2;

                                return board;
                                break;
                            }
                        }
                    }
                    if(r - 3 >= 0 && c + 3 >= 0) {
                        if (board[r][c] !== null && board[r - 1][c + 1] !== null && board[r - 2][c + 2] === null && board[r - 3][c + 3] !== null) {
                            if (board[r][c] === 2 && board[r-1][c + 2] !== null && board[r - 1][c + 1] === 2 && board[r - 3][c + 3] === 2 && this.topCheck(board, c + 2)) {
                                board[r - 2][c + 2] = this.state.player2;

                                return board;
                                break;
                            }
                        }
                    }



                    if(r + 3 <= 5 && c + 3 <= 6) {
                        if (board[r][c] !== null && board[r + 1][c + 1] !== null && board[r + 2][c + 2] === null && board[r + 3][c + 3] !== null && this.topCheck(board, c + 2)) {
                            if (board[r][c] === 2 && board[r + 1][c + 1] === 2 && board[r + 3][c + 2] !== null && board[r + 3][c + 3] === 2) {
                                board[r + 2][c + 2] = this.state.player2;

                                return board;
                                break;
                            }
                        }
                    }
                    if(r + 3 <= 5 && c + 3 <= 6) {
                        if (board[r][c] !== null && board[r+1][c+1] === null && board[r+2][c+2] !== null && board[r+3][c+3] !== null && this.topCheck(board, c + 1)){
                            if(board[r][c] === 2 && board[r+2][c+1] !== null && board[r+2][c+2] === 2 && board[r+3][c+3] === 2){
                                board[r+1][c+1] = this.state.player2;

                                return board;
                                break;
                            }

                        }
                    }
                    if(r+2 <= 5 && c+ 2 <= 6 && r-1 >= 0 && c-1 >= 0){
                        if(board[r][c] !== null && board[r+1][c+1] !== null && board[r+2][c+2] !== null && this.topCheck(board,c-1)){
                            if(board[r][c] === 2 && board[r+1][c+1] === 2 && board[r+2][c+2] === 2 && board[r-1][c-1] === null && board[r][c-1] !== null){
                                board[r-1][c-1] = this.state.player2;

                                return board;
                                break;
                            }
                        }
                    }
                    if(c+3 <= 6 && c-1 >= 0) {
                        if (board[r][c] !== null && board[r][c + 1] === null && board[r][c + 2] !== null && board[r][c - 1] === null && board[r][c + 3] === null && this.topCheck(board, c + 1)) {
                            if (r !== 5) {
                                if (board[r][c] === 2 && board[r][c + 2] === 2 && board[r + 1][c + 1] !== null) {
                                    board[r][c + 1] = this.state.player2;

                                    return board;
                                    break;
                                }
                            } else if (r === 5) {
                                if (board[r][c] === 2 && board[r][c + 2] === 2) {
                                    board[r][c + 1] = this.state.player2;

                                    return board;
                                    break;
                                }
                            }

                        }
                    }
                    if(c + 2 <= 6 && r + 1 <= 5 && c-1 >= 0) {
                        if (board[r][c] !== null && board[r][c + 1] !== null && board[r][c - 1] === null && board[r][c + 2] === null && this.topCheck(board, c -1)) {
                            if (board[r][c] === 2 && board[r][c + 1] === 2 && board[r + 1][c - 1] !== null) {

                                board[r][c - 1] = this.state.player2;
                                return board;
                                break;
                            }
                        }
                    }else if(r === 5 && board[r][c] === 2 && board[r][c+1] === 2 && board[r][c-1] === null && board[r][c+2] === null && this.topCheck(board,c - 1)){
                        board[r][c-1] = this.state.player2;

                        return board;
                        break;
                    }

                    if((r + 4 <= 5 && c + 3 <= 6) || r === 2) {
                        if (board[r][c] === 2 && board[r + 1][c + 1] === 2 && board[r + 2][c + 2] === 2 && r === 2 && board[r + 3][c + 3] === null) {
                            board[r + 3][c + 3] = this.state.player2;
                            return board;
                            break;
                        } else if (board[r][c] === 2 && board[r + 1][c + 1] === 2 && board[r + 3][c + 3] === 2 && this.topCheck(board, c + 3) && board[r + 3][c + 3] === null && board[r + 4][c + 3] !== null) {
                            board[r + 3][c + 3] = this.state.player2;
                            return board;
                            break;
                        }
                    }

                    if((r -3 >= 0 && r + 2 <= 5 && c + 3 <= 6 && c - 1 >= 0) || r === 4){
                        if(board[r][c] === 2 && board[r-1][c+1] === 2 && board[r-2][c+2] === 2) {
                            if (board[r + 1][c - 1] === null && r + 1 === 5) {
                                board[r + 1][c - 1] = this.state.player2;
                                return board;
                                break;
                            } else if (board[r + 1][c - 1] === null && board[r + 2][c - 1] !== null) {
                                board[r + 1][c - 1] = this.state.player2;
                                return board;
                                break;
                            } else if (board[r - 3][c + 3] === null && board[r - 2][c + 3] !== null) {
                                board[r - 3][c + 3] = this.state.player2;
                                return board;
                                break;
                            }
                        }

                    }

                }
                count++;
            }
            // console.log(count);
            // console.log(board);
            if (count !== 5) {
                console.log("smart move no return");
            } else {
                //board = this.aiEasy(board);
                return [0,0];
            }
        }
    }
    aiMoreAtt(board){
        //console.log("attack light called");
        if(!this.state.gameOver) {
            let count = 0;
            for (let r = 5; r > 0; r--) {
                for (let c = 0; c < 7; c++) {
                    if(fullRows.includes(c)){
                        c++;
                    }
                    if (board[r][c] !== null && board[r][c + 1] !== null  && this.topCheck(board, c)) {
                        if (board[r][c] === 2 && board[r][c + 1] === 2) {
                            //horizontal
                            //  console.log("caught more 2 horizontal");
                            //  console.log("r: " + r + " c: " + c);
                            if (r !== 5 && c < 4) {
                                if (board[r][c + 2] === null && board[r + 1][c + 2] !== null  && this.topCheck(board, c + 2)) {
                                    board[r][c + 2] = this.state.player2;
                                    this.checkBelow(board, r, c);
                                    console.log("1111111");
                                    console.log(board);
                                    return board;
                                    count--;
                                    break;
                                } else if (board[r][c - 1] === null && board[r + 1][c - 1] !== null && this.topCheck(board, c -1)) {
                                    board[r][c - 1] = this.state.player2;
                                    this.checkBelow(board, r, c);
                                    console.log("1111111");
                                    console.log(board);
                                    return board;
                                    count--;
                                    break;
                                }
                            } else {
                                if (r + 1 <= 5 && c + 2 <= 6) {
                                    if (board[r + 1][c + 2] !== null && board[r][c + 2] === null && this.topCheck(board, c + 2)) {
                                        board[r][c + 2] = this.state.player2;
                                        this.checkBelow(board, r, c);
                                        console.log("1111111");
                                        console.log(board);
                                        return board;
                                        count--;
                                        break;
                                    } else if (board[r][c - 1] === null && this.topCheck(board, c - 1)) {
                                        board[r][c - 1] = this.state.player2;
                                        this.checkBelow(board, r, c);
                                        console.log("1111111");
                                        console.log(board);
                                        return board;
                                        count--;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    if (board[r][c] !== null && board[r - 1][c] !== null  && this.topCheck(board, c)) {
                        //console.log("vert");
                        if (board[r][c] === 2 && board[r - 1][c] === 2  && this.topCheck(board, c)) {
                            //vertical
                            //  console.log("caught more vertical");
                            //  console.log("r: " + r + " c: " + c);
                            if (board[r - 2][c] === null && (r - 2) >= 0) {
                                if(board[r-2][c+1] !== 1 && board[r-1][c+2] !== 1 && board[r][c+3] !== 1) {
                                    board[r - 2][c] = this.state.player2;
                                    this.checkBelow(board, r, c);
                                    console.log("1111111");
                                    console.log(board);
                                    return board;
                                    count--;
                                    break;
                                }
                            }
                        }
                    }
                    if (board[r][c] !== null && board[r - 1][c + 1] !== null) {
                        //console.log("dright");
                        if (1 === board[r][c] && 1 === board[r - 1][c + 1]) {
                            //diagonal right
                            //  console.log("caught more d right");
                            //  console.log("r: " + r + " c: " + c);
                            if (r - 3 >= 0 && c + 2 <= 6) {
                                if (board[r - 2][c + 2] === null && board[r - 3][c + 2] !== null && this.topCheck(board, c + 2)) {
                                    board[r - 2][c + 2] = this.state.player2;
                                    this.checkBelow(board, r, c);
                                    console.log("1111111");
                                    console.log(board);
                                    return board;
                                    count--;
                                    break;
                                }
                            } else if (c !== 0  && this.topCheck(board, c - 1)) {
                                if (board[r + 1][c - 1] === null && board[r + 2][c - 1] !== null) {
                                    board[r + 1][c - 1] = this.state.player2;
                                    this.checkBelow(board, r, c);
                                    console.log("1111111");
                                    console.log(board);
                                    return board;
                                    count--;
                                    break;
                                }
                            }
                        }
                    }
                    if (board[r][c] !== null && board[r - 1][c + 1] !== null) {
                        if (1 === board[r][c] && 1 === board[r - 1][c + 1]) {
                            //diagonal left
                            //  console.log("caught more d left");
                            //  console.log("r: " + r + " c: " + c);
                            if (r - 2 >= 0 && c - 2 >= 0) {
                                if (board[r - 2][c - 2] === null && board[r - 1][c - 2] !== null && this.topCheck(board, c-2)) {
                                    board[r - 2][c - 2] = this.state.player2;
                                    this.checkBelow(board, r, c);
                                    console.log("1111111");
                                    console.log(board);
                                    return board;
                                    count--;
                                    break;
                                }
                            } else if (r + 2 <= 5 && c + 1 <= 6  && this.topCheck(board, c + 1)) {
                                if (board[r + 1][c + 1] === null && board[r + 2][c + 1] !== null) {
                                    board[r + 1][c + 1] = this.state.player2;
                                    this.checkBelow(board, r, c);
                                    console.log("1111111");
                                    console.log(board);
                                    return board;
                                    count--;
                                    break;
                                }
                            }
                        }
                    }

                }
                count++;
            }
            // console.log(count);
            // console.log(board);
            if (count !== 5) {
                console.log("smart move no return");
            } else {
                //board = this.aiEasy(board);
                return [0,0];
            }
        }
    }
    aiMoreDef(board){
        if(!this.state.gameOver) {
            let count = 0;
            for (let r = 5; r > 0; r--) {
                for (let c = 0; c < 7; c++) {
                    if(fullRows.includes(c)){
                        c++;
                    }
                    if (board[r][c] !== null && board[r][c + 1] !== null) {
                        if (board[r][c] === 1 && board[r][c + 1] === 1) {
                            //horizontal
                            // console.log("caught more 2 horizontal");
                            // console.log("r: " + r + " c: " + c);
                            if (r !== 5 && c < 4) {
                                if (board[r][c + 2] === null && board[r - 1][c + 2] !== null  && this.topCheck(board, c + 2)) {
                                    this.checkBelow(board, r, c);
                                    console.log("1111111");
                                    console.log(board);
                                    board[r][c + 2] = this.state.player2;
                                    //console.log("1");
                                    return board;
                                    count--;
                                    break;
                                } else if (board[r][c - 1] === null && board[r -1][c - 1] !== null  && this.topCheck(board, c - 1) && board[r+1][c-1] !== null) {
                                    board[r][c - 1] = this.state.player2;
                                    this.checkBelow(board, r, c);
                                    console.log("1111111");
                                    console.log(board);
                                    //console.log("2");
                                    return board;
                                    count--;
                                    break;
                                }
                            } else {
                                if (r + 1 <= 5 && c + 2 <= 6) {
                                    if (board[r + 1][c + 2] !== null && board[r][c + 2] === null && this.topCheck(board, c + 2)) {
                                        board[r][c + 2] = this.state.player2;
                                        this.checkBelow(board, r, c);
                                        console.log("1111111");
                                        console.log(board);
                                        //console.log("3");
                                        return board;
                                        count--;
                                        break;
                                    } else if (board[r][c - 1] === null && this.topCheck(board, c - 1)) {
                                        board[r][c - 1] = this.state.player2;
                                        this.checkBelow(board, r, c);
                                        console.log("1111111");
                                        console.log(board);
                                        //console.log("4");
                                        return board;
                                        count--;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    if (board[r][c] !== null && board[r - 1][c] !== null && this.topCheck(board, c)) {
                        // console.log("vert");
                        if (board[r][c] === 1 && board[r - 1][c] === 1  && this.topCheck(board, c)) {
                            //vertical
                            // console.log("caught more vertical");
                            // console.log("r: " + r + " c: " + c);
                            if (board[r - 2][c] === null && (r - 2) >= 0  && this.topCheck(board, c)) {
                                board[r - 2][c] = this.state.player2;
                                this.checkBelow(board, r, c);
                                console.log("1111111");
                                console.log(board);
                                //console.log("5");
                                return board;
                                count--;
                                break;
                            }
                        }
                    }
                    if (board[r][c] !== null && board[r - 1][c + 1] !== null) {
                        //console.log("dright");
                        if (1 === board[r][c] && 1 === board[r - 1][c + 1]) {
                            //diagonal right
                            // console.log("caught more d right");
                            // console.log("r: " + r + " c: " + c);
                            if (r - 3 >= 0 && c+2 <= 6) {
                                if (board[r - 2][c + 2] === null && board[r - 3][c + 2] !== null  && this.topCheck(board, c + 2)) {
                                    board[r - 2][c + 2] = this.state.player2;
                                    this.checkBelow(board, r, c);
                                    console.log("1111111");
                                    console.log(board);
                                    //console.log("6");
                                    return board;
                                    count--;
                                    break;
                                }
                            } else if (c !== 0  && this.topCheck(board, c - 1)) {
                                if (board[r + 1][c - 1] === null && board[r + 2][c - 1] !== null  && this.topCheck(board, c - 1)) {
                                    board[r + 1][c - 1] = this.state.player2;
                                    this.checkBelow(board, r, c);
                                    console.log("1111111");
                                    console.log(board);
                                    //console.log("7");
                                    return board;
                                    count--;
                                    break;
                                }
                            }
                        }
                    }
                    if (board[r][c] !== null && board[r - 1][c + 1] !== null) {
                        if (1 === board[r][c] && 1 === board[r - 1][c + 1]) {
                            //diagonal left
                            // console.log("caught more d left");
                            // console.log("r: " + r + " c: " + c);
                            if (r - 2 >= 0 && c - 2 >= 0) {
                                if (board[r - 2][c - 2] === null && board[r - 1][c - 2] !== null  && this.topCheck(board, c - 2)) {
                                    board[r - 2][c - 2] = this.state.player2;
                                    this.checkBelow(board, r, c);
                                    console.log("1111111");
                                    console.log(board);
                                    //console.log("8");
                                    return board;
                                    count--;
                                    break;
                                }
                            } else if (r + 2 <= 5 && c + 1 <= 6  && this.topCheck(board, c + 1)) {
                                if (board[r + 1][c + 1] === null && board[r + 2][c + 1] !== null  && this.topCheck(board, c)) {
                                    board[r + 1][c + 1] = this.state.player2;
                                    this.checkBelow(board, r, c);
                                    console.log("1111111");
                                    console.log(board);
                                    //console.log("9");
                                    return board;
                                    count--;
                                    break;
                                }
                            }
                        }
                    }
                    if(board[r][c] !== null && board[r][c+1] === null && board[r][c+2] !== null && this.topCheck(board, c + 1)){
                        if(c + 2 <= 6){
                            if(board[r][c] === 1 && board[r][c+2] === 1 && r === 5){
                                board[r][c+1] = this.state.player2;
                                this.checkBelow(board, r, c);
                                console.log("1111111");
                                console.log(board);
                                return board;
                                break;
                            }else if(board[r][c] === 1 && board[r][c+2] === 1 && board[r+1][c + 1] !== null){
                                board[r][c+1] = this.state.player2;
                                this.checkBelow(board, r, c);
                                console.log("1111111");
                                console.log(board);
                                return board;
                                break;
                            }
                        }
                    }
                }
                count++;
            }
            if (count !== 5) {
                console.log("smart move no return");
            } else {
                //board = this.aiEasy(board);
                return [0,0];
            }
        }
    }
    checkBelow(board, r, c){
        if(r !== 5) {
            if (board[r + 1][c] !== null) {
                console.log("TRUE");
            } else console.log("FALSE");
        }
    }
    aiTestDef(){
        //blank
        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, null, null, null, null];
        // let array3 = [null, null, null, null, null, null, null];
        // let array4 = [null, null, null, null, null, null, null];
        // let array5 = [null, null, null, null, null, null, null];

        //4 bottom
        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, null, null, null, null];
        // let array3 = [null, null, null, null, null, null, null];
        // let array4 = [null, null, null, null, null, null, null];
        // let array5 = [null, null, 1, 1, 1, null, null];
        //
        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, null, null, null, null];
        // let array3 = [null, null, null, null, null, null, null];
        // let array4 = [null, null, null, null, null, null, null];
        // let array5 = [1, null, 1, 1, null, null, null];
        //
        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, null, null, null, null];
        // let array3 = [null, null, null, null, null, null, null];
        // let array4 = [null, null, null, null, null, null, null];
        // let array5 = [null, 1, 1, null, 1, null, null];
        //
        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, null, null, null, null];
        // let array3 = [null, null, null, null, null, null, null];
        // let array4 = [null, null, null, null, null, null, null];
        // let array5 = [null, null, null, null, 1, 1, 1];


        //2nd row
        //     let array0 = [null, null, null, null, null, null, null];
        //     let array1 = [null, null, null, null, null, null, null];
        //     let array2 = [null, null, null, null, null, null, null];
        //     let array3 = [null, null, null, null, null, null, null];
        //     let array4 = [null, null, 1, 1, 1, null, null];
        //     let array5 = [1, 2, 1, 2, 1, 2, 1];
        //     //
        //     let array0 = [null, null, null, null, null, null, null];
        //     let array1 = [null, null, null, null, null, null, null];
        //     let array2 = [null, null, null, null, null, null, null];
        //     let array3 = [null, null, null, null, null, null, null];
        //     let array4 = [1, null, 1, 1, null, null, null];
        //     let array5 = [1, 2, 1, 2, 1, 2, 1];
        //     //
        //     let array0 = [null, null, null, null, null, null, null];
        //     let array1 = [null, null, null, null, null, null, null];
        //     let array2 = [null, null, null, null, null, null, null];
        //     let array3 = [null, null, null, null, null, null, null];
        //     let array4 = [null, 1, 1, null, 1, null, null];
        //     let array5 = [1, 2, 1, 2, 1, 2, 1];
        //     //
        //     let array0 = [null, null, null, null, null, null, null];
        //     let array1 = [null, null, null, null, null, null, null];
        //     let array2 = [null, null, null, null, null, null, null];
        //     let array3 = [null, null, null, null, null, null, null];
        //     let array4 = [null, null, null, null, 1, 1, 1];
        //     let array5 = [1, 2, 1, 2, 1, 2, 1];

        //3rd row

        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, null, null, null, null];
        // let array3 = [null, 1, 1, 1, null, null, null];
        // let array4 = [2, 2, 2, 1, 2, 2, 2];
        // let array5 = [1, 2, 1, 2, 1, 2, 1];
        //
        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, null, null, null, null];
        // let array3 = [1, null, 1, 1, null, null, null];
        // let array4 = [2, 2, 2, 1, 2, 2, 2];
        // let array5 = [1, 2, 1, 2, 1, 2, 1];

        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, null, null, null, null];
        // let array3 = [null, null, 1, 1, null, 1, null];
        // let array4 = [2, 2, 2, 1, 2, 2, 2];
        // let array5 = [1, 2, 1, 2, 1, 2, 1];
        //
        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, null, null, null, null];
        // let array3 = [null, null, null, null, 1, 1, 1];
        // let array4 = [2, 2, 1, 2, 1, 2, 2];
        // let array5 = [1, 2, 1, 2, 2, 2, 1];

        //diaganol
        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, null, null, null, null];
        // let array3 = [null, 2, 1, null, null, null, null];
        // let array4 = [2, 2, 2, 1, 2, 2, 2];
        // let array5 = [1, 1, 1, 2, 1, 1, 1];
        //
        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, null, null, null, null];
        // let array3 = [null, null, null, null, 1, 2, null];
        // let array4 = [2, 2, 2, 1, 2, 2, 2];
        // let array5 = [1, 1, 1, 2, 1, 1, 1];
        //
        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, null, 2, 1, null];
        // let array3 = [null, null, null, null, 1, 2, null];
        // let array4 = [2, 2, 1, null, 1, 2, 2];
        // let array5 = [1, 1, 1, 2, 1, 1, 1];

        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, null, null, 1, null];
        // let array3 = [null, null, null, null, null, 2, null];
        // let array4 = [2, 2, 1, 1, 1, 2, 2];
        // let array5 = [1, 1, 1, 2, 1, 1, 1];
        //
        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, 1, 2, null, null, null, null];
        // let array3 = [null, 2, 1, null, null, null, null];
        // let array4 = [2, 2, 1, null, 1, 2, 2];
        // let array5 = [1, 1, 1, 2, 1, 1, 1];

        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, 1, null, null, null, null, null];
        // let array3 = [null, 2, null, null, null, null, null];
        // let array4 = [2, 2, 1, 1, 1, 2, 2];
        // let array5 = [1, 1, 1, 2, 1, 1, 1];

        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, null, null, null, null];
        // let array3 = [null, 1, 1, 2, null, null, null];
        // let array4 = [2, 2, 2, 1, 1, 2, 2];
        // let array5 = [1, 1, 1, 2, 1, 1, 1];

        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, null, null, null, null];
        // let array3 = [null, null, 1, 2, 1, 2, null];
        // let array4 = [2, 2, 2, 1, 2, 1, 2];
        // let array5 = [1, 1, 1, 2, 1, 1, 2];

        //random tests
        //   let array0 = [null, null, null, null, null, null, null];
        //   let array1 = [null, null, null, null, null, null, null];
        //   let array2 = [null, 2, 2, null, null, null, null];
        //   let array3 = [null, 1, 1, 1, 2, null, null];
        //   let array4 = [null, 2, 2, 1, 1, 2, 2];
        //   let array5 = [null, 1, 1, 2, 1, 1, 1];

        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, 2, 2, null, null, null, null];
        // let array3 = [null, 1, 1, 1, 2, null, null];
        // let array4 = [null, 2, 2, 1, 1, 2, null];
        // let array5 = [null, 1, 1, 2, 1, 1, null];
        // array3 = array3.reverse();
        // array2 = array2.reverse();


        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, null, null, null, null];
        // let array3 = [null, null, null, null, null, null, null];
        // let array4 = [null, null, null, 1, 1, 1, null];
        // let array5 = [null, null, null, 1, 2, 2, null];

        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, null, null, null, null];
        // let array3 = [null, null, null, 2, null, null, null];
        // let array4 = [null, 1, null, 1, null, null, null];
        // let array5 = [2, 2, 1, 1, 2, null, null];

        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, null, null, null, null];
        // let array3 = [null, null, null, null, null, null, null];
        // let array4 = [null, null, null, null, null, null, null];
        // let array5 = [null, null, 1, null, 1, null, null];

        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, null, null, null, null];
        // let array3 = [null, null, 2, null, null, null, null];
        // let array4 = [1, null, 1, 1, 2, null, null];
        // let array5 = [2, null, 1, 1, 2, null, null];

        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, null, null, null, null];
        // let array3 = [null, null, null, null, null, null, null];
        // let array4 = [null, null, null, 1, null, 1, 1];
        // let array5 = [null, null, null, 1, 2, 2, 1];
        //
        // let array0 = [null, null, null, null, null, null, 1];
        // let array1 = [null, null, null, null, null, 1, null];
        // let array2 = [null, null, null, null, null, null, null];
        // let array3 = [null, null, null, 1, 1, null, null];
        // let array4 = [null, null, null, null, null, null, null];
        // let array5 = [null, null, null, null, null, null, null];

        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, 1, null, null, null, null, null];
        // let array2 = [null, null, 1, null, null, null, null];
        // let array3 = [null, null, null, null, null, null, null];
        // let array4 = [null, null, null, 1, 1, null, null];
        // let array5 = [null, null, null, null, null, null, null];

        // let array0 = [null, 1, 1, null, 1, null, null];
        // let array1 = [null, null, null, 2, null, null, null];
        // let array2 = [null, null, null, null, null, null, null];
        // let array3 = [null, null, null, null, null, null, null];
        // let array4 = [null, null, null, null, null, null, null];
        // let array5 = [null, null, null, null, null, null, null];

        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, null, null, null, null];
        // let array3 = [null, null, null, null, null, null, null];
        // let array4 = [null, null, null, null, null, null, null];
        // let array5 = [null, 1, 1, null, null, null, null];

        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, null, null, null, null];
        // let array3 = [null, null, null, null, null, null, null];
        // let array4 = [null, null, null, 1, null, null, null];
        // let array5 = [null, 2, 1, 1, 2, null, null];

        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, 1, null, null, null, null];
        // let array2 = [null, null, 2, null, null, null, null];
        // let array3 = [null, null, 1, null, null, null, null];
        // let array4 = [null, null, 2, null, null, null, null];
        // let array5 = [null, null, 1, null, null, null, null];
        //
        // let array0 = [2, 2, 1, 2, 1, 2, null];
        // let array1 = [1, 2, 1, 2, 1, 1, 1];
        // let array2 = [1, 1, 2, 2, 1, 2, 2];
        // let array3 = [2, 2, 1, 1, 2, 2, 2];
        // let array4 = [1, 2, 2, 2, 1, 1, 1];
        // let array5 = [2, 2, 1, 1, 2, 1, 1];

        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, null, null, null, null];
        // let array3 = [null, null, null, 2, null, null, null];
        // let array4 = [null, 1, 1, 1, null, 1, null];
        // let array5 = [null, 2, 2, 1, null, 2, null];

        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, null, null, null, null];
        // let array3 = [null, null, 1, null, null, null, null];
        // let array4 = [null, 2, 1, 1, 2, 1, null];
        // let array5 = [2, 2, 2, 1, 1, 1, 2];


        //offensive testing

        // let array0 = [null, null, null, null, 2, null, null];
        // let array1 = [null, null, null, 1, 1, 2, null];
        // let array2 = [null, null, 1, 2, 1, 1, null];
        // let array3 = [null, 2, 2, 1, 2, 2, null];
        // let array4 = [null, 1, 1, 2, 1, 2, null];
        // let array5 = [2, 2, 1, 1, 1, 2, null];

        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, 2, null, null, null];
        // let array3 = [null, null, null, null, 2, null, null];
        // let array4 = [null, null, null, null, null, 2, null];
        // let array5 = [null, null, null, null, null, null, null];


        // let array0 = [null, null, null, null, null, null, null];
        // let array1 = [null, null, null, null, null, null, null];
        // let array2 = [null, null, null, 2, 2, null, null];
        // let array3 = [null, null, 2, null, null, null, null];
        // let array4 = [null, null, null, null, null, null, null];
        // let array5 = [2, 2, null, null, null, null, null];
        //
        // //
        // //
        // let testBoard = [array0, array1, array2, array3, array4, array5];
        // this.setState({testBoard, currentPlayer: this.togglePlayer()});
        // this.ai(testBoard);

    }
    ai(board) {
        // console.log("state");
        // console.log(this.state.board);
        //console.log("ai");
        //console.log(board);
        //place random start
        let personInfo = JSON.parse(this.state.apiResponse);
        globalInfo = personInfo;
        console.log(personInfo);
        //let challenge = personInfo[0]
        let intellect = personInfo.traits[0].children[4].percentile;
        let cautioness = personInfo.traits[1].children[1].percentile;
        let selfDiscipline = personInfo.traits[1].children[4].percentile;
        let assertiveness = personInfo.traits[2].children[1].percentile;
        let stress = personInfo.traits[4].children[5].percentile;
        let challenge = personInfo.needs[0].percentile;
        console.log(this.state.url.newUrl);
        console.log(intellect);
        console.log(cautioness);
        console.log(selfDiscipline);
        console.log(assertiveness);
        console.log(stress);
        console.log(challenge);
        if(!this.state.gameOver) {
            if(this.state.url.newUrl.toLowerCase() === 'http://localhost:9000/testapi?name=realdonaldtrump'){
                board = this.aiEasy(board);
            }else if(challenge >= 0.5 && intellect >= 0.5) {
                let att = this.aiAttack(board);
                if (att.length >= 3) {
                    //attH++;
                    console.log("att: ");
                    board = att;
                } else {
                    let def = this.aiDefend(board);
                    if (def.length >= 3) {
                        //defH++;
                        console.log("def: ");
                        board = def;
                    } else {
                        let moreDef = this.aiMoreDef(board);
                        if (moreDef.length >= 3) {
                            //attl++;
                            //console.log("attL: " + attl);
                            console.log("defL");
                            board = moreDef;
                        } else {

                            let moreAtt = this.aiMoreAtt(board);
                            if (moreAtt.length >= 3) {
                                //defl++;
                                //console.log("defL: " + defl);
                                console.log("attL");
                                board = moreAtt;
                            } else board = this.aiEasy(board);
                        }
                    }
                }
                this.setState({board, currentPlayer: this.togglePlayer()});
            }else if(assertiveness <= 0.5 && stress >= 0.5){
                let att = this.aiAttack(board);
                if (att.length >= 3) {
                    //attH++;
                    console.log("att: ");
                    board = att;
                } else {
                    let moreAtt = this.aiMoreAtt(board);
                    if (moreAtt.length >= 3) {
                        //defH++;
                        console.log("attL ");
                        board = moreAtt;
                    } else {
                        let def = this.aiDefend(board);
                        if (def.length >= 3) {
                            //attl++;
                            //console.log("attL: " + attl);
                            console.log("def");
                            board = def;
                        } else {
                            let moreDef = this.aiMoreDef(board);
                            if (moreDef.length >= 3) {
                                //defl++;
                                //console.log("defL: " + defl);
                                console.log("defL");
                                board = moreDef;
                            } else board = this.aiEasy(board);
                        }
                    }
                }
                this.setState({board, currentPlayer: this.togglePlayer()});
            }else if(assertiveness >= 0.5 && challenge >= 0.5){
                let def = this.aiDefend(board);
                if (def.length >= 3) {
                    //attH++;
                    console.log("def: ");
                    board = def;
                } else {
                    let moreDef = this.aiMoreDef(board);

                    if (moreDef.length >= 3) {
                        //defH++;
                        console.log("defL ");
                        board = moreDef;
                    } else {
                        let att = this.aiAttack(board);
                        if (att.length >= 3) {
                            //attl++;
                            //console.log("attL: " + attl);
                            console.log("att");
                            board = att;
                        } else {
                            let moreAtt = this.aiMoreAtt(board);
                            if (moreAtt.length >= 3) {
                                //defl++;
                                //console.log("defL: " + defl);
                                console.log("attL");
                                board = moreAtt;
                            } else board = this.aiEasy(board);
                        }
                    }
                }
                this.setState({board, currentPlayer: this.togglePlayer()});
            }else if (cautioness >= 0.5){
                let att = this.aiAttack(board);

                if (att.length >= 3) {
                    //attH++;
                    console.log("att: ");
                    board = att;
                } else {

                    let def = this.aiDefend(board);
                    if (def.length >= 3) {
                        //defH++;
                        console.log("def ");
                        board = def;
                    } else {
                        let moreAtt = this.aiMoreAtt(board);
                        if (moreAtt.length >= 3) {
                            //attl++;
                            //console.log("attL: " + attl);
                            console.log("attL");
                            board = moreAtt;
                        } else {

                            let moreDef = this.aiMoreDef(board);
                            if (moreDef.length >= 3) {
                                //defl++;
                                //console.log("defL: " + defl);
                                console.log("attL");
                                board = moreDef;
                            } else board = this.aiEasy(board);
                        }
                    }
                }
                this.setState({board, currentPlayer: this.togglePlayer()});
            }else {
                let att = this.aiAttack(board);

                if (att.length >= 3) {
                    //attH++;
                    console.log("att: ");
                    board = att;
                } else {

                    let def = this.aiDefend(board);
                    if (def.length >= 3) {
                        //defH++;
                        console.log("def ");
                        board = def;
                    } else {
                        let moreAtt = this.aiMoreAtt(board);
                        if (moreAtt.length >= 3) {
                            //attl++;
                            //console.log("attL: " + attl);
                            console.log("attL");
                            board = moreAtt;
                        } else {

                            let moreDef = this.aiMoreDef(board);
                            if (moreDef.length >= 3) {
                                //defl++;
                                //console.log("defL: " + defl);
                                console.log("attL");
                                board = moreDef;
                            } else board = this.aiEasy(board);
                        }
                    }
                }
                this.setState({board, currentPlayer: this.togglePlayer()});
            }

        }



        //place random end


        //check win below
        if (!this.state.gameOver) {
            let result = this.checkAll(board);
            if (result === this.state.player1) {
                //console.log("10"); //for red wins
                this.setState({board, gameOver: true, message: 'Player 1 (red) wins!'});
            } else if (result === this.state.player2) {
                //console.log("11"); //for yellow wins
                this.setState({board, gameOver: true, message: 'Player 2 (yellow) wins!'});
            } else if (result === 'draw') {
                //console.log("12"); //for draw game
                this.setState({board, gameOver: true, message: 'Draw game.'});
            } else {
                //console.log("13"); //toggles to next player

                this.setState({board, currentPlayer: this.togglePlayer()});
            }
        }
        else
        {
            //console.log("14"); //only if click after game is over
            this.setState({message: 'Game over. Please start a new game.'});
        }
    }

    checkVertical(board) {
        // Check only if row is 3 or greater
        //console.log("15");
        // console.log("end");
        // console.log(board)
        for (let r = 3; r < 6; r++) {
            for (let c = 0; c < 7; c++) {
                if (board[r][c]) {
                    if (board[r][c] === board[r - 1][c] &&
                        board[r][c] === board[r - 2][c] &&
                        board[r][c] === board[r - 3][c]) {
                        //console.log("16");
                        return board[r][c];
                    }
                }
            }
        }
    }

    checkHorizontal(board) {
        // Check only if column is 3 or less
        //console.log("17");
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c]) {
                    if (board[r][c] === board[r][c + 1] &&
                        board[r][c] === board[r][c + 2] &&
                        board[r][c] === board[r][c + 3]) {
                        //console.log("18");
                        return board[r][c];
                    }
                }
            }
        }
    }

    checkDiagonalRight(board) {
        // Check only if row is 3 or greater AND column is 3 or less
        //console.log("19");
        for (let r = 3; r < 6; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c]) {
                    if (board[r][c] === board[r - 1][c + 1] &&
                        board[r][c] === board[r - 2][c + 2] &&
                        board[r][c] === board[r - 3][c + 3]) {
                        //console.log("20");
                        return board[r][c];
                    }
                }
            }
        }
    }

    checkDiagonalLeft(board) {
        // Check only if row is 3 or greater AND column is 3 or greater
        //console.log("21");
        for (let r = 3; r < 6; r++) {
            for (let c = 3; c < 7; c++) {
                if (board[r][c]) {
                    if (board[r][c] === board[r - 1][c - 1] &&
                        board[r][c] === board[r - 2][c - 2] &&
                        board[r][c] === board[r - 3][c - 3]) {
                        //console.log("22");
                        return board[r][c];
                    }
                }
            }
        }
    }

    checkDraw(board) {
        //console.log("22");
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 7; c++) {
                if (board[r][c] === null) {
                    //console.log("23")
                    return null;
                }
            }
        }
        //console.log("24");
        return 'draw';
    }

    checkAll(board) {
        //console.log("25"); //runs after every move
        //checks for wins below and passes in the game board
        return this.checkVertical(board) || this.checkDiagonalRight(board) || this.checkDiagonalLeft(board) || this.checkHorizontal(board) || this.checkDraw(board);
    }

    componentWillMount() {
        //console.log("26"); //4: only on start
      let that = this;
        setTimeout(timer, 4000)
        function timer(){
            console.log(that.state.apiResponse[2])
            if(that.state.apiResponse[2].toString() !== "D") {
                globalInfo = JSON.parse(that.state.apiResponse);
                need.push(globalInfo.needs);
                trait0.push(globalInfo.traits[0].children);
                trait1.push(globalInfo.traits[1].children);
                trait2.push(globalInfo.traits[2].children);
                trait3.push(globalInfo.traits[3].children);
                trait4.push(globalInfo.traits[4].children);
                console.log("info");
                console.log(need);
                console.log(trait0);
                console.log(trait1);
                console.log(trait2);
                console.log(trait3);
                console.log(trait4);
                showLoad = 0;
                that.initBoard();
            }else {
                showLoad = 2;
                that.initBoard();
            }
            console.log(showLoad);
        }
        this.aiTestDef();
    }
//<p className="App-intro">{this.state.apiResponse}</p>
    render() {
        return (
            <div>

                <Link className="button" to="/">Home</Link>
                <div className="button" onClick={() => {this.initBoard()}}>New Game</div>

                <table>
                    <thead>
                    </thead>
                    <tbody>
                    {this.state.board.map((row, i) => (<Row key={i} row={row} play={this.play} />))}
                    </tbody>
                </table>
                <Load />
                <p className="message">{this.state.message}</p>
            </div>
        );
    }
}
//console.log("27"); //1: only on start
// Row component
const Row = ({ row, play }) => {
    return (
        <tr>
            {row.map((cell, i) => <Cell key={i} value={cell} columnIndex={i} play={play} />)}
        </tr>
    );
};
const Load = ({}) => {
    let show = "Getting Personality Traits...";
    console.log(showLoad);
        if(showLoad === 1) {
            return (
                <div className="loadGif">
                    <h2 className="loadTitle">{show}</h2>
                    <img className="loadSrc" src={loading}/>
                </div>
            )
        }else if(showLoad === 2) {
            show = "Cannot Find Twitter User";
            return(
            <div>
                <h2 className="loadTitle">{show}</h2>
                <h4 className="loadTitle">AI settings: Default</h4>
            </div>
            )
        }else return (
                <div className='aiInfo'>
                    <h4>What the AI knows about you</h4>
                    <div className='container'>

                    {need[0].map((needs) =>
                        <div className='record'>
                        <div className="bar">
                            <span>{needs.name}</span> <div className='p' style={{marginLeft: Math.floor(need.percentile*100) + 'px'}} ><span>{Math.floor(needs.percentile*100)}%</span></div>
                        </div>
                        </div>
                    )}

                    {trait0[0].map((trait) =>
                        <div className='record'>
                            <div className="bar" >
                                <span>{trait.name}</span> <div className='p' style={{marginLeft: Math.floor(trait.percentile*100) + 'px'}}><span>{Math.floor(trait.percentile*100)}%</span></div>
                            </div>
                        </div>
                    )}
                    {trait1[0].map((trait) =>
                        <div className='record'>
                            <div className="bar">
                                <span>{trait.name}</span><div className='p' style={{marginLeft: Math.floor(trait.percentile*100) + 'px'}} ><span> {Math.floor(trait.percentile*100)}%</span></div>
                            </div>
                        </div>
                    )}
                    {trait2[0].map((trait) =>
                        <div className='record'>
                            <div className="bar">
                                <span>{trait.name}</span><div className='p' style={{marginLeft: Math.floor(trait.percentile*100) + 'px'}} ><span> {Math.floor(trait.percentile*100)}%</span></div>
                            </div>
                        </div>
                    )}
                    {trait3[0].map((trait) =>
                        <div className='record'>
                            <div className="bar" >
                                <span>{trait.name}</span><div className='p' style={{marginLeft: Math.floor(trait.percentile*100) + 'px'}} ><span> {Math.floor(trait.percentile*100)}%</span></div>
                            </div>
                        </div>
                    )}
                    {trait4[0].map((trait) =>
                        <div className='record'>
                            <div className="bar" >
                                <span>{trait.name}</span><div className='p' style={{marginLeft: Math.floor(trait.percentile*100) + 'px'}} ><span> {Math.floor(trait.percentile*100)}%</span></div>
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            )


}
//console.log("28"); //2: only on start
const Cell = ({ value, columnIndex, play }) => {
    let color = 'white';
    if (value === 1) {
        color = 'red';
    } else if (value === 2) {
        color = 'yellow';
    }
//console.log("29"); //end of each move runs 42 times
    return (
        <td>
            <div className="cell" onClick={() => {play(columnIndex)}}>
                <div className={color}></div>
            </div>
        </td>
    );
};
Game.propTypes = {
    completedUrl: PropTypes.object.isRequired
}
export default Game;
