import React, { Component } from "react";
import axios from "axios";
import Alert from "../../components/Alert"
import { Input } from "../../components/Form";
import { Col, Row, Container } from "../../components/Grid";
import { Link } from "react-router-dom";
import { Jumbotron } from "react-bootstrap";
import "./Signup.css";

class Signup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: "",
            lastName: "",
            username: '',
            password: '',
            gender: "",
            age: 13,
            location: "",
            message: "",
            formValid: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    handleSubmit(event) {
        event.preventDefault();
        console.log('sign-up handleSubmit, username: ');
        console.log(this.state.username);
        const { history } = this.props;
        //if (!formValid)
        //request to server to add a new username/password
        axios.post('/user', {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            username: this.state.username,
            password: this.state.password,
            gender: this.state.gender,
            age: this.state.age,
            location: this.state.location
        })
            .then(response => {
                console.log(response)
                if (!response.data.errmsg) { //redirect to login page
                    console.log('successful signup')
                    history.push("/login");
                } else {
                    console.log('username already taken')
                    this.setState({userValid: false, message: "That username is already in use. Please pick a different username." })
                }
            }).catch(error => {
                console.log('signup error: ')
                console.log(error)
                this.setState({ message: "Something went wrong...oops! Please try again later." })
            })
    }

    render() {
        return (
            <Jumbotron className="JumboSignUp">
                <Container fluid>
                    <div className="signContainer">
                        <Row>
                            <Col size="6">
                                {(this.state.message) ?
                                    <Alert message={this.state.message} /> :
                                    <h4 className="heading4">Please Fill Out All Fields!</h4>}
                                <form className="formSign">
                                    <p className="pSign">First name: </p>
                                    <Input value={this.state.firstName}
                                        onChange={this.handleInputChange}
                                        name="firstName"
                                        placeholder="Your first name" />
                                    <p className="pSign">Last name: </p>
                                    <Input value={this.state.lastName}
                                        onChange={this.handleInputChange}
                                        name="lastName"
                                        placeholder="Your last name" />
                                    <p className="pSign">Username: </p>
                                    <Input value={this.state.username}
                                        onChange={this.handleInputChange}
                                        name="username"
                                        placeholder="Your desired username" />
                                    <p className="pSign">Password: </p>
                                    <Input value={this.state.password}
                                        onChange={this.handleInputChange}
                                        name="password" type="password"
                                        placeholder="Password" />
                                    <p className="pSign">Gender</p>
                                    <Input value={this.state.gender}
                                        onChange={this.handleInputChange}
                                        name="gender"
                                        placeholder="Gender" />
                                    <p className="pSign">Age: </p>
                                    <Input type="number" min="13" max="120" value={this.state.age}
                                        onChange={this.handleInputChange}
                                        name="age" />
                                    <p className="pSign">Location: </p>
                                    <Input value={this.state.location}
                                        onChange={this.handleInputChange}
                                        name="location"
                                        placeholder="Location" />
                                    <button className="btn btn-primary btnSign" onClick={this.handleSubmit} type="submit">Register</button>
                                </form>
                            </Col>
                            <Col size="12">
                                <Link to="/login">
                                    <button className="btn btn-warning btnExist">Login with an existing account</button>
                                </Link>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </Jumbotron>
        );
    }
}

export default Signup;