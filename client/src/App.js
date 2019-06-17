import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Landing from "./pages/Landing/";
import Dashboard from "./pages/Dashboard/";
import Challenges from "./pages/Challenges/";
import Login from "./pages/Login/";
import Signup from "./pages/Signup/";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer"
import AllActivities from "./pages/AllActivities";
import NewActivity from "./pages/NewActivity";
import ActivityDetail from "./pages/ActivityDetail";
import ChallengeSignUp from "./pages/ChallengeSignUp";
import NoMatch from "./pages/NoMatch";
import Navbar from './components/NavbarLoggedIn';
import { isNullOrUndefined } from 'util';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false,
      username: null
    }

    this.getUser = this.getUser.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    //this.updateUser = this.updateUser.bind(this)
  }

  componentDidMount() {
    this.getUser()
  }

  updateUser(userObject) {
    this.setState(userObject)
  }

  getUser() {
    axios.get('/user').then(response => {
      console.log(response);
      if (response.data.user !== null) {
        console.log('Get User: There is a user saved in the server session: ')
        console.log(response.data.user.username);
        this.setState({
          loggedIn: true,
          username: response.data.user.username
        });
      } else {
        console.log('Get user: no user');
        this.setState({
          loggedIn: false,
          username: null
        })
      }
    })
  }

  render() {
    return (
      <Router>
      {(this.state.loggedIn && this.state.username) ?
      <Navbar updateUser={this.updateUser} loggedIn={this.state.loggedIn} />:
      <Header />}
      <div>
        <Switch>
          <Route exact path="/login" 
          render={(props) => <Login {...props} getUser={this.getUser} loggedIn={this.state.loggedIn} />}
          />
          <Route exact path="/dashboard" 
          render={(props) => <Dashboard {...props} loggedIn={this.state.loggedIn} username={this.state.username} />}
          />
          <Route exact path="/all-activities" component={AllActivities} />
          <Route exact path="/api/activities/:id" render={(props) => <ActivityDetail {...props} loggedIn={this.state.loggedIn} username={this.state.username} />}
          />
          <Route exact path="/newactivity" 
          render={(props) => <NewActivity {...props} loggedIn={this.state.loggedIn} username={this.state.username} />}
          />
          <Route exact path="/challenges" component={Challenges} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/" 
          render={(props) => <Landing {...props} loggedIn={this.state.loggedIn} username={this.state.username} />}
          />
          <Route exact path="/ChallengeSignUp" component={ChallengeSignUp} />
          <Route exact path="/" 
          // render={(props) => <Landing {...props} loggedIn={this.state.loggedIn} user={this.state.username} />}
          />
          <Route component={NoMatch} />
        </Switch>
      </div>
      <Footer />
    </Router>
    );
  }
}

export default App;
