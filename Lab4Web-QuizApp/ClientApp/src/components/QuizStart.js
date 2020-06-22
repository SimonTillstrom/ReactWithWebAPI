import React, { Component } from 'react'
import authService from './api-authorization/AuthorizeService'
import Quiz from './Quiz'
import apiCalls from '../helpers/ajaxCalls'

class QuizStart extends Component {
    constructor() {
        super()
        this.state = {
            score: 0,
            quizComplete: false,
            isDatabaseSeeded: false,
            seedStatus: "",
            isWantToPlay: false,
            questionData: [],
            token: {},
            isAuthenticated: false,
            isUserAnAdmin: false,
            isAdminSeeded: false,
            user: {}
        }
        this.fetchQuizData = this.fetchQuizData.bind(this)
        this.seedDatabase = this.seedDatabase.bind(this)
        this.renderQuiz = this.renderQuiz.bind(this)
        this.genericHandler = this.genericHandler.bind(this)
    }

    componentDidMount() {
        this.checkUserRole();
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
                isDatabaseSeeded: true
            })
        }
    }

    async seedDatabase() {
        const { isDatabaseSeeded, isAdminSeeded, token } = this.state
        if (isDatabaseSeeded === false) {
            const result = apiCalls.genericFetch("database", "PUT", token)
            this.setState({ seedStatus: result.description })
        }

        if (isAdminSeeded === false) {
            const result = await apiCalls.genericFetch("database", "POST", token)
            if (result.success === true) {
                this.setState({ isAdminSeeded: true })
            } else {
                console.log(result.description);
            }
        }
        this.fetchQuizData()
    }

    renderQuiz() {
        if (this.state.questionData === null) {
            this.renderButtons()
        }
        return (
            <div>
                <Quiz />
            </div>
        )
    }

    genericHandler = (event) => {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    renderButtons(isDatabaseSeeded) {
        let buttonName = isDatabaseSeeded ? "isWantToPlay" : "seedDatabase"
        let buttonValue = isDatabaseSeeded ? this.state.isWantToPlay : this.state.seedDatabase
        let buttonStyling = isDatabaseSeeded ? "btn btn-success" : "btn btn-danger"
        let buttonOnClick = isDatabaseSeeded ? this.genericHandler : this.seedDatabase
        let buttonText = isDatabaseSeeded ? "Play Game!" : "Seed the database"

        return (
            <div>
                <button
                    name={buttonName}
                    value={buttonValue}
                    className={buttonStyling}
                    onClick={buttonOnClick}
                >
                    {buttonText}
                </button>
            </div>
        )
    }

    render() {
        const { isAuthenticated, isWantToPlay, isDatabaseSeeded } = this.state
        let buttons = isWantToPlay ?
            this.renderQuiz() : this.renderButtons(isDatabaseSeeded)
        let content = isAuthenticated ? buttons : <p>Please login before proceeding.</p>

        return (
            <div>
                {content}
            </div>
        )
    }
}

export default QuizStart