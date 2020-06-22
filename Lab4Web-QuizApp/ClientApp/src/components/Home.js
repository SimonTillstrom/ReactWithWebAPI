import React, { Component } from "react";
import authService from './api-authorization/AuthorizeService'
import apiCalls from '../helpers/ajaxCalls'

export class Home extends Component {
    static displayName = Home.name;
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            token: {},
            user: {},
            isUserAnAdmin: false,
            questionData: [],
            isDatabaseSeeded: false,
            isAdminSeeded: false,
        };
    }
    async componentDidMount() {
        await this.checkUserRole();
        await this.seedDatabase();
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
            const result = await apiCalls.genericFetch("database", "PUT", token)
            this.setState({ seedStatus: result.description })
        }
        if (isAdminSeeded === false) {
            const result = await apiCalls.genericFetch("database", "POST", token)
            if (result.success === true) {
                this.setState({ isAdminSeeded: true })
            } else {
            }
        }

        await this.fetchQuizData()
    }

    renderInstructions() {
        return (
            <div>
                <h2>Welcome!</h2>
                <ol>
                    <li>As the app starts it will now attempt to create the database and seed it automatically.
                        In the case that it does not, you'll be required to register and navigate to "Home".</li>
                    <li>Admin login:</li>
                    <ul>
                        <li>
                            Username: admin@admin.com
                        </li>
                        <li>
                            Password: Admin1½
                        </li>
                    </ul>
                    <li>In the case that it is still not seeded, go to "Quiz" and click the button.</li>
                </ol>
            </div>
        )
    }

    render() {
        const content = this.renderInstructions()
        return (
            <div>
                {content}
            </div>
        );
    }
}
