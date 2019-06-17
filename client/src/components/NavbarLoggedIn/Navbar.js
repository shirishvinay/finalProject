import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../Header/Header.css"
import axios from "axios";

class Navbar extends Component {
  constructor() {
    super()
    this.logout = this.logout.bind(this)
  }

  logout(event) {
    event.preventDefault()
    console.log('logging out')
    const history = this.props.history
    axios.post('/user/logout').then(response => {
      console.log(response.data)
      if (response.status === 200) {
        this.props.getUser();
        history.push("/");
      }
    }).catch(error => {
      console.log('Logout error');
      console.log(error);
    })
  }
  render() {
    return (
      <nav className="header navbar navbar-expand-lg navbar-light">
        <a className="navbar-brand" href="/dashboard">FitMonkeys</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="/dashboard">Dashboard</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Challenges">Challenges</a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Activities</a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="/newactivity">New Activity</a>
                <a className="dropdown-item" href="/all-activities">View All Activities</a>
              </div>
            </li>
          </ul>
          <div>
            <Link to="#" className="btn btn-link text-secondary" onClick={this.logout}>
              <span className="text-secondary">Logout</span>
            </Link>
          </div>
        </div>
      </nav>
    )
  }
}

export default Navbar;