import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import "./Login.css";
import { Jumbotron, Container, Row, Col } from "react-bootstrap";

class LoginForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loggedIn: this.props.loggedIn,
            username: '',
            password: '',
            message: ""
            //redirect: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    /*handleRedirect = () => {
        if (this.state.redirect) {
          return <Redirect to='/dashboard' />
        }
      }*/

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit(event) {
        event.preventDefault()
        console.log('handleSubmit')
        this.setState({ message: "Logging in..." })
        const { history } = this.props;
        axios
            .post('/user/login', {
                username: this.state.username,
                password: this.state.password
            })
            .then(res => {
                console.log('login response: ')
                console.log(res)
                if (res.status === 200) {
                    // update App.js state
                    this.props.getUser();   
                    history.push("/dashboard");
        }
        }).catch(error => {
                console.log('login error: ')
                console.log(error);
                this.setState({ message: "Something went wrong...oops! Please try again later." })
            })
    }

    render() {
        if (this.state.loggedIn) {
            return <Redirect to={'/dashboard'} />
        } else {
            return (
                <Jumbotron className="JumboLogin">
                <div className="container">
                    <div className="container containerLog">
                        <Row>
                            <Container className="contLog">
                            <Col lg="auto">
                                {/* <h5>Login</h5> */}
                                <br />
                                <form className="form-horizontal">
                                    <div className="form-group">
                                        <div className="col-1 col-ml-auto">
                                            <label className="form-label" htmlFor="username">Username</label>
                                        </div>
                                        <div className="col-3 col-mr-auto">
                                            <input className="form-input"
                                                type="text"
                                                id="username"
                                                name="username"
                                                placeholder="Username"
                                                value={this.state.username}
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="col-1 col-ml-auto">
                                            <label className="form-label" htmlFor="password">Password: </label>
                                        </div>
                                        <div className="col-3 col-mr-auto">
                                            <input className="form-input"
                                                placeholder="password"
                                                type="password"
                                                name="password"
                                                value={this.state.password}
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="container">
                                        <div className="form-group ">
                                            <button className="btn btn-primary btnLog" onClick={this.handleSubmit} type="submit">Login</button>
                                        </div>
                                    </div>
                                </form>
                            </Col>
                            </Container>
                        </Row>
                    </div>
                </div>
                </Jumbotron>
            )
        }
    }
}

export default LoginForm
