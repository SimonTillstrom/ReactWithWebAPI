import React, { Component } from "react"
import Question from "./Question"
import authService from './api-authorization/AuthorizeService'
import apiCalls from '../helpers/ajaxCalls'
import { Link } from "react-router-dom";

class Quiz extends Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0,
      score: 0,
      questionData: [],
      token: {},
      user: {},
      isAuthenticated: false,
      quizComplete: false,
      isCorrectAnswer: false,
      invalidAnswerSelected: false
    }
    this.handleAnswerSelection = this.handleAnswerSelection.bind(this)
    this.submitScore = this.submitScore.bind(this)
    this.resetGame = this.resetGame.bind(this)
  }

  componentDidMount() {
    this.getUserData()
  }

  async getUserData() {
    const token = await authService.getAccessToken();
    const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()])
    this.setState({
      isAuthenticated: isAuthenticated,
      user: user,
      token: token
    });
    if (user != null) {
      await this.fetchQuizData()
    }
  }

  async fetchQuizData() {
    const result = await apiCalls.genericFetch("questions", "GET", this.state.token)
    if (result.length > 0) {
      this.setState({
        questionData: result
      })
    }
  }

  handleAnswerSelection(selectedAnswer) {
    if (selectedAnswer.isCorrectAnswer === true) {
      this.setState(previousState => ({
        score: previousState.score + 1,
        isCorrectAnswer: true,
        invalidAnswerSelected: false
      }));
    } else {
      this.setState({
        isCorrectAnswer: false,
        invalidAnswerSelected: true
      })
    }
  }

  loadQuestion() {
    if (this.state.index === this.state.questionData.length - 1) {
      this.submitScore();
    } else {
      this.setState(previousState => ({
        index: previousState.index + 1,
        isCorrectAnswer: false,
        invalidAnswerSelected: false,
      }))
    }
  }

  async submitScore() {
    let { score, user } = this.state
    let userId = user.sub
    let scoreData = { score, userId }

    await fetch('highscore', {
      method: 'POST',
      headers: !this.state.token ?
        {} : { 'Authorization': `Bearer ${this.state.token}`, 'Content-type': 'application/json' },
      body: JSON.stringify(scoreData)
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          quizComplete: true
        })
      })
      .catch(error => {
      });
  }

  renderAnswerSelected() {
    const { index, questionData, isCorrectAnswer, invalidAnswerSelected } = this.state

    if (isCorrectAnswer && index + 1 === questionData.length) {
      return (
        <div>
          <h2>Correct! You have {this.state.score} points!</h2>
          <button className="btn btn-success" onClick={() => this.loadQuestion()}>Finalize quiz</button>
        </div>
      )
    }
    else if (invalidAnswerSelected && index + 1 === questionData.length) {
      return (
        <div>
          <h2>Oops! Looks like it was the wrong answer.</h2>
          <button className="btn btn-success" onClick={() => this.loadQuestion()}>Finish quiz</button>
        </div>
      )
    }
    else if (isCorrectAnswer) {
      return (
        <div>
          <h2>Correct! You have {this.state.score} points!</h2>
          <button className="btn btn-success" onClick={() => this.loadQuestion()}>Next question</button>
        </div>
      )
    }
    else if (invalidAnswerSelected) {
      return (
        <div>
          <h2>Oops! Looks like it was the wrong answer.</h2>
          <button className="btn btn-primary" onClick={() => this.loadQuestion()}>Next question</button>
        </div>
      )
    }
  }

  resetGame() {
    this.setState({
      index: 0,
      score: 0,
      quizComplete: false,
      isCorrectAnswer: false,
      invalidAnswerSelected: false
    })
  }

  renderFinalOptions() {
    let message = null
    this.state.score < 1 ?
      message = `Better luck next time! Score: ${this.state.score}` :
      message = `Well done! You scored a total of ${this.state.score}!`

    return (
      <div>
        <h1>{message}</h1>
        <button className="btn btn-primary" onClick={() => this.resetGame()}>Play again</button>
        <Link to="/scoreboard">
          <button className="btn btn-primary">Go to Scoreboard</button>
        </Link>
      </div>
    )
  }


  render() {
    let content = null;
    let index = this.state.index
    let data = this.state.questionData[index]

    if (!this.state.questionData.length > 0) {
      this.fetchQuizData();
    }
    else {
      if (this.state.isCorrectAnswer || this.state.invalidAnswerSelected) {
        content = null
      }
      else {
        content = <Question
          question={data}
          handler={this.handleAnswerSelection}
        />
      }
    }

    let allowedOrNot = this.state.isAuthenticated ? content : null
    let answerContent = this.state.quizComplete ? this.renderFinalOptions() : this.renderAnswerSelected()

    return (
      <div>
        {allowedOrNot}
        {answerContent}
      </div>
    )
  }
}

export default Quiz;
