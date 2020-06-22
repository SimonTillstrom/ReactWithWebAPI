import React, { Component } from "react";
import {
  Collapse,
  Container,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
} from "reactstrap";
import { Link } from "react-router-dom";
import { LoginMenu } from "./api-authorization/LoginMenu";
import "./NavMenu.css";
import authService from './api-authorization/AuthorizeService'
import apiCalls from '../helpers/ajaxCalls'


export class NavMenu extends Component {
  static displayName = NavMenu.name;
  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
      isAuthenticated: false,
      token: {},
      user: {},
      isUserAnAdmin: false
    };
  }

  async componentDidMount() {
    await this.checkUserRole();
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

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  renderNavbarNormal() {
    return (
      <header>
        <Navbar
          className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3"
          light
        >
          <Container>
            <NavbarBrand tag={Link} to="/">
              Lab4Web_QuizApp
            </NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse
              className="d-sm-inline-flex flex-sm-row-reverse"
              isOpen={!this.state.collapsed}
              navbar
            >
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="basicNavlink" to="/">
                    Home
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="basicNavlink" to="/quiz-start">
                    Quiz
                  </NavLink>
                </NavItem>
                <NavItem className="basicNavlink">
                  <NavLink tag={Link} className="basicNavlink" to="/scoreboard">
                    Scoreboard
                  </NavLink>
                </NavItem>
                <LoginMenu></LoginMenu>
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    )
  }

  renderNavbarAdmin() {
    return (
      <header>
        <Navbar
          className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3"
          light
        >
          <Container>
            <NavbarBrand className="basicNavlink" tag={Link} to="/">
              Quiz!
          </NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse
              className="d-sm-inline-flex flex-sm-row-reverse"
              isOpen={!this.state.collapsed}
              navbar
            >
              <ul className="flex-grow basicNavlink navbar-nav">
                <NavItem>
                  <NavLink tag={Link} className="basicNavlink" to="/">
                    Home
                </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="basicNavlink" to="/quiz-start">
                    Quiz
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="basicNavlink" to="/scoreboard">
                    Scoreboard
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    tag={Link}
                    className="basicNavlink"
                    to="/admin-page"
                  >
                    AdminPage
                </NavLink>
                </NavItem>
                <LoginMenu className="basicNavlink"></LoginMenu>
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    )
  }


  render() {
    const { isUserAnAdmin } = this.state
    let content = isUserAnAdmin ? this.renderNavbarAdmin() : this.renderNavbarNormal()

    return (
      <div>
        {content}
      </div>
    );
  }

}
