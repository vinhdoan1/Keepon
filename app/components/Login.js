var React = require('react');
import { Container, Row, Col } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { login } from "../actions/";
import { connect } from "react-redux";
var api = require('../utils/api');

@connect((store) => {
  return {
  }
})
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: undefined,
      password: undefined,
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
    var loggedID = api.login(this.state.username, this.state.password);
    console.log(loggedID);
    if (loggedID != null) {
      var user = {
        id: loggedID,
      };

      this.props.dispatch(login(user));

      this.props.history.push({
        pathname: '/home',
      });
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
              <Input name="username" id="usernameForm" placeholder="Username"/>
            </Row>
            <Row>
              <Input type="password" name="password" id="passForm" placeholder="Password"/>
            </Row>
          </Form>
          <Row>
            <Button onClick={this.onLogin}>Login</Button>
          </Row>
          <Row>
            <Button onClick={this.onNewUser}>New user? Sign up here</Button>
          </Row>
        </Container>
      </div>
    )
  }
}

module.exports = Login;
