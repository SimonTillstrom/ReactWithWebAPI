import React, { Component } from "react";
import PropTypes from "prop-types";
import authService from './api-authorization/AuthorizeService'
import DeleteQuestion from './DeleteQuestion'
import QuestionForm from './QuestionForm'
import QuestionList from './QuestionList'
import apiCalls from '../helpers/ajaxCalls'

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        question: "",
        answer1: "",
        answer2: "",
        answer3: "",
        correctAnswer: "",
      },
      loading: true,
      errors: {},
      questionData: [],
      isDatabaseSeeded: false,
      token: {},
      isUserAnAdmin: false,
      user: {},
      renderMethod: [],
    };
    this.fetchQuizData = this.fetchQuizData.bind(this);
    this.stateHandler = this.stateHandler.bind(this);
  }

  async stateHandler(option, questionData) {
    if(questionData){
    this.setState(prevState => {
      let data = { ...prevState.data };
      data.question = questionData.questionString;
      data.answer1 = questionData.answerOptions[0].answerString;
      data.answer2 = questionData.answerOptions[1].answerString;
      data.answer3 = questionData.answerOptions[2].answerString;
      return { data };
    })}
    if (option === "delete") {
      this.setState({
        renderMethod:<DeleteQuestion question={questionData} stateHandler={this.stateHandler}/>
      })
    }
    else if(option === "list"){
      this.setState({
        renderMethod:<QuestionList state={this.state} stateHandler={this.stateHandler}/>
      })
      await this.fetchQuizData();
    }
    else {
      this.setState({
        renderMethod:<QuestionForm questionData={questionData} option={option} stateHandler={this.stateHandler}/>
      })
    }
  }
  async getUserData() {
    const token = await authService.getAccessToken();
    const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()])
    this.setState({
      isAuthenticated: isAuthenticated,
      user: user,
      token: token
    });
  }

  async checkUserRole() {
    await this.getUserData();
    if (this.state.user != null) {
      const result = await apiCalls.genericFetch("database", "GET", this.state.token)
      if (result.success === true) {
        this.setState({
          isUserAnAdmin: true
        })
      }
      this.fetchQuizData();
    }
  }

  async fetchQuizData() {
    const result = await apiCalls.genericFetch("questions", "GET", this.state.token)
   
    if (result.length > 0) {
        this.setState({
            questionData: result,
            isDatabaseSeeded: true,
          })
          this.setState({
            renderMethod: <QuestionList state={this.state} stateHandler={this.stateHandler}/>
          })
    }
    else{
      this.setState({
        renderMethod: <button className="btn btn-primary" onClick={() => this.stateHandler("newQuestion", null)} >New question</button>
      })
    }
}

  renderForbidden() {
    return (
        <p>You don't have access to this page</p>
    )
  }

  async componentDidMount() {
    await this.checkUserRole();
  }

  render() {
    let adminCheckResult = this.state.isUserAnAdmin ? this.state.renderMethod : this.renderForbidden()
    return (
      <div>
        {adminCheckResult}
      </div>
    );
  }
}

AdminPage.propTypes = {
  submitNewQuestion: PropTypes.func.isRequired,
};

export default AdminPage;
