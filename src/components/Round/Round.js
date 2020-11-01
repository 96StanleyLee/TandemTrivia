import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Results from '../Results/Results'
// CSS 
import './Round.css';

class Round extends Component {
    state = {
        roundsList: this.props.roundsList,
        answers: [],
        index: 0,
        tally: [],
        questionNumber: 1,
    }

    // * Create an answers array with both wrong and right answers *
    answersArr = (wrong, right) => {
        let answers = this.state.answers;
        for(let i = 0; i < wrong.length; i++) {
            answers.push(JSON.stringify(wrong[i]))
        }
        answers.push(right)
        // console.log(`Answers array ${answers}`)

        // Randomizes answers array
        function shuffle (array) {
            let currentIndex = array.length, tempVal, randomIndex;
            while (0 !== currentIndex) {
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;
        
                    tempVal = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = tempVal;
                }
            return array;
        };
        answers = shuffle(answers);
        // console.log(`ANSWERS SHUF ${answers}`)
        if (answers.length < 4) {
            let emptyAns = document.getElementById("button3");
            emptyAns.setAttribute("class", "empty")
        }
        return answers;
    }
    

    onAnswer = (e) => {
        // variable holding the list of 10 random rounds
        let roundsList = this.state.roundsList;
        // variable holding the current round 
        let currentRound = roundsList[this.state.index];
        let currentCorrect = JSON.stringify(currentRound.correct);
       
        // If you click a choice and it is wrong, function will add false to an array and vice versa 
        let tally = this.state.tally;
        
        if (e.target.innerHTML == currentCorrect) {
            tally.push(true);
            e.target.setAttribute("class", "true")
            // e.target.className += "true"
        } else {
            tally.push(false);
            e.target.setAttribute("class", "false")
            // e.target.className += "false"
        }
     
        // * Disables all the answer button so another selection cannot be made *
        let buttons = document.querySelectorAll("#button");
        buttons.forEach(function(button) {
            button.disabled = true;
        })
        let emptyAns = document.getElementById("button3");
        emptyAns.disabled = true;
        console.log(`Tally: ${tally}`)
        // return tally;
        console.log(`Tally length: ${tally.length}`)
        if (tally.length > 9) {
            let endGame = document.querySelector("#endgame");
            endGame.setAttribute("class", "showResults")
            let next = document.querySelector("#next");
            next.setAttribute("class", "endgame")
        } 
    }

    // * Increases the index in state by 1. On click, this will update the current round to a new round *
    nextQuestion = () => {
        let tally = this.state.tally;
        let roundsList = this.state.roundsList;
        if (tally.length > 9) {
            let endGame = document.querySelector("#endgame");
            endGame.setAttribute("class", "showResults")
        } else {
            this.setState({ index: (this.state.index +1) % roundsList.length});
            let buttons = document.querySelectorAll("#button");
            
            // * Enables the buttons to be selected again  and removes class responsible for color *
            buttons.forEach(function(button) {
                button.setAttribute("class", "no")
                button.disabled = false;
            })
            this.setState({ answers: [] })
            let emptyAns = document.getElementById("button3");
            emptyAns.setAttribute("class", "no")
            emptyAns.disabled = false;
        }
        let questionNum = this.state.questionNumber + 1;
        this.setState({ questionNumber: questionNum })
    };

    
    
    render() {
        // variable holding the list of 10 random rounds
        let roundsList = this.state.roundsList;
        // console.log(`Rounds List: ${JSON.stringify(roundsList)}`);
        // variable holding the current round 
        let currentRound = roundsList[this.state.index];
        let currentIncorrects = currentRound.incorrect;
        let currentCorrect = JSON.stringify(currentRound.correct);
        let currentQuestion = JSON.stringify(currentRound.question);
        let answers = this.answersArr(currentIncorrects, currentCorrect)

        console.log(`ANSWERS: ${answers.length}`)
        
        return (
            <div className="round-cont startpage">
                <div className="round-wrap">
                    <div className="bottom-span"></div>
                    <h3 className="question">Question <span id="question">{this.state.questionNumber}</span>: </h3>
                    <p>{currentQuestion}</p>
                    <ul className="round-choices">
                        <li><button id="button" onClick={this.onAnswer}>{answers[0]}</button></li>
                        <li><button id="button" onClick={this.onAnswer}>{answers[1]}</button></li>
                        <li><button id="button" onClick={this.onAnswer}>{answers[2]}</button></li>
                        <li><button id="button3" onClick={this.onAnswer}>{answers[3]}</button></li>
                    </ul>
                    <button className="next-btn" id="next" onClick={this.nextQuestion}>Next</button>

                
                    <Link to={{
                        pathname: '/results',
                        aboutProps: {
                            name: 'Info was clicked from results',
                            tally: this.state.tally
                        }
                        
                    }}> 
                        <button id="endgame" className="endgame" onClick={this.endGame}>See Results</button>
                    </Link>
                    
                    

                    
                   
                </div>
            </div>
        )
    }
};

export default Round;