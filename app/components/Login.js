var React = require('react');
import { Container, Row, Col } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

class Login extends React.Component {
  render() {
    var keeponLogoImg = require('../images/keepon_logo.png');

    return (
      <div className="login-container">
        <Container>
          <img src={keeponLogoImg}/>
          <Row>
            <Input name="username" id="usernameForm" placeholder="Username"/>
          </Row>
          <Row>
            <Input type="password" name="password" id="passForm" placeholder="Password"/>
          </Row>
          <Row>
            <Button onClick={() => {this.props.history.push({
          pathname: '/home',
        });}}>Login</Button>
          </Row>
          <Row>
            <Button>New user? Sign up here</Button>
          </Row>
        </Container>
      </div>
    )
  }
}

module.exports = Login;
