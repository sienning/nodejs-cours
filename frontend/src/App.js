import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Accueil from './components/Accueil';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Posts from './components/Posts';
import Post from './components/Post';
import WritePost from './components/WritePost';
import Profile from './components/Profile';
import SeeProfile from './components/SeeProfile';
import { Button } from 'semantic-ui-react';
import axios from 'axios';
import './App.css'

class App extends Component {
  state = {
    isConnected: false,
    email: "",
    userInfo: {},
    userData: {},
  }

  componentDidMount() {
    if (window.localStorage.getItem('email') !== null) {
      this.getUserInfo(window.localStorage.getItem('email'), window.localStorage.getItem('token'))
      this.setState({
        isConnected: true,
        email: window.localStorage.getItem('email'),
        userInfo: window.localStorage.getItem('userInfo')
      });
    } else {
      this.setState({
        isConnected: false,
        email: "",
        userInfo: {}
      });
    }
  }

  getUserInfo = async (email, token) => {
    await axios.post(`http://localhost:3000/user/see-user`, {
      email: email
    },{
      headers: {
        Authorization: token
      }
    })
      .then(response => {
        const res = response.data;
        this.setState({
          userData: res
        });
      })
      .catch(err => console.log(err))
  }

  getEmail = (email, userInfo) => {
    localStorage.setItem("email", email);
    localStorage.setItem("token", userInfo.token);
    localStorage.setItem("userId", userInfo.userId);

    this.setState({ email: email, userInfo: userInfo, isConnected: true });
  }

  logout = () => {
    localStorage.clear();
    this.setState({ email: "", userInfo: {}, isConnected: false });
    window.location.replace("/login");
  }

  render() {
    const {
      email,
      userData,
      isConnected,
    } = this.state;
    return (
      <div>
        <Router>
          <div>
            <nav className="navbar" style={{ background: "lightgrey", width: "100%" }}>
              <ul style={{ display: "inline-flex", listStyle: "none" }}>
                <li style={{ marginRight: 10 }}>Node JS - A5 - IWM</li>
              {
                  isConnected ?
                    <li style={{ marginRight: 10 }}>
                  <Link to="/">Accueil</Link>
                    </li> : null
                }
                {
                  isConnected ?
                    <li style={{ marginRight: 10 }}>
                      <Link to="/posts">Posts</Link>
                    </li> : null
                }
                {
                  isConnected ? null :
                    <li style={{ marginRight: 10 }}>
                      <Link to="/signup">S'inscrire</Link>
                    </li>
                }
                {
                  isConnected ? null :
                    <li style={{ marginRight: 10 }}>
                      <Link to="/login">Se connecter</Link>
                    </li>
                }


              </ul>
              <ul style={{ float: 'right', display: "inline-flex", listStyle: "none" }}>
                {
                  isConnected ?
                    <li style={{ float: 'right', marginRight: 10 }} >
                      <Link to="/profile">Mon profil</Link>
                    </li> : null
                }
                {
                  isConnected ?
                    <li style={{ marginTop: -8, marginRight: 10 }} >
                      <Button onClick={this.logout}>Se déconnecter</Button>
                    </li> : null
                }
              </ul>
            </nav>

            <Switch >
              <Route path="/login">
                <Login
                  login={this.login}
                  getEmail={this.getEmail}
                />
              </Route>
              <Route path="/signup">
                <SignUp
                  getEmail={this.getEmail}
                />
              </Route>
              <Route path="/posts">
                <Posts
                  email={email}
                />
              </Route>
              <Route path="/post/:id">
                <Post
                  email={email}
                />
              </Route>
              <Route path="/write-post">
                <WritePost />
              </Route>
              <Route path="/profile">
                <Profile />
              </Route>
              <Route path="/see-profile/:email">
                <SeeProfile  />
              </Route>
              <Route exact path="/">
                <Accueil
                  email={email}
                  userData={userData}
                />
              </Route>
            </Switch>
          </div>
        </Router>
      </div >
    );
  }
}

export default App;
