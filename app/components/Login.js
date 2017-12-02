var React = require('react');
import { Container, Row, Col } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { login } from "../actions/";
import { connect } from "react-redux";
var api = require('../utils/api');
import ReactGA from 'react-ga';
ReactGA.initialize('UA-110103238-1');
ReactGA.pageview(window.location.pathname + window.location.search);

@connect((store) => {
  return {
  }
})
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errorMessage: "",
    };

    this.onFormChange = this.onFormChange.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onNewUser = this.onNewUser.bind(this);
  }

  onFormChange(e) {
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value});
  }

  onNewUser() {
    this.props.history.push({
      pathname: '/newuser',
    });
  }

  onLogin() {
    if (this.state.username == "" || this.state.password == "") {
      this.setState({errorMessage: "Please fill out all fields."});
      return;
    }

    var loggedID = api.login(this.state.username, this.state.password);
    if (loggedID != null) {
      var user = {
        id: loggedID,
      };

      this.props.dispatch(login(user));

      this.props.history.push({
        pathname: '/home',
      });
    } else {
      this.setState({errorMessage: "No matching username/password."});
    }
  }

  render() {
    var keeponLogoImg = require('../images/keepon_logo.png');

    return (
      <div className="login-container">
        <Container>
          <img src={keeponLogoImg}/>
          <Form onChange={this.onFormChange}>
            <Row>
              <Col xs={12}>
                <Input name="username" id="usernameForm" placeholder="Username"/>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Input type="password" name="password" id="passForm" placeholder="Password"/>
              </Col>
            </Row>
          </Form>
          <p className="errorMessage">{this.state.errorMessage}</p>
          <Row>
            <Button onClick={this.onLogin}>Login</Button>
          </Row>
          <Row>
            <Button onClick={this.onNewUser} id="newUserButton" >New user? Sign up here</Button>
          </Row>
        </Container>
      </div>
    )
  }
}

module.exports = Login;
