var React = require('react');
import { Container, Row, Col } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { connect } from "react-redux";
import { login } from "../actions/";
var api = require('../utils/api');
import ReactGA from 'react-ga';
ReactGA.initialize('UA-110103238-1');
ReactGA.pageview(window.location.pathname + window.location.search);

@connect((store) => {
  return {
    userProfile: store.user
  }
})
class NewUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: undefined,
      password: undefined,
    };

    this.onFormChange = this.onFormChange.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onFormChange(e) {
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value});
  }

  onCancel() {
    this.props.history.push({
      pathname: '/',
    });
  }

  onSubmit() {
    var userID = api.addUser(this.state.username, this.state.password);
    var user = {
      id: userID,
    };
    this.props.dispatch(login(user));
    this.props.history.push({
      pathname: '/home',
    });
  }

  render() {
    var keeponLogoImg = require('../images/keepon_logo.png');

    return (
      <div className="login-container">
        <Container>
          <img src={keeponLogoImg}/>
          <Row>
            <Col xs={12}>
            <Form onChange={this.onFormChange}>
              <FormGroup>
                <Label for="usernameForm">Enter new username:</Label>
                <Input name="username" id="usernameForm" placeholder="Username"/>
              </FormGroup>
              <FormGroup>
                <Label for="passForm">Enter password:</Label>
                <Input type="password" name="password" id="passForm" placeholder="Password"/>
              </FormGroup>
            </Form>
            </Col>
          </Row>
          <Row>
            <Button onClick={this.onCancel}>Cancel</Button>
          </Row>
          <Row>
            <Button onClick={this.onSubmit}>Create Account</Button>
          </Row>
        </Container>
      </div>
    )
  }
}

module.exports = NewUser;
