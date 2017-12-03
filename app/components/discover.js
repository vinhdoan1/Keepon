var React = require('react');
var TopBar = require('./TopBar');
var CouponData = require('./CouponData');
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Form, FormGroup, Label, Input, FormText, InputGroup, InputGroupAddon } from 'reactstrap';
import Icon from 'react-icons-kit';
import { ic_search } from 'react-icons-kit/md/ic_search';
import ReactGA from 'react-ga';
ReactGA.initialize('UA-110103238-1');
ReactGA.pageview(window.location.pathname + window.location.search);

class Discover extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      value: undefined,
      zipEntered: "",
      zipDisplay: "",
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event){
    this.setState({zipEntered: event.target.value});
  }

  onSubmit(event){
    this.setState({zipDisplay: this.state.zipEntered});
  }

  render(){

    var filters = [];

    filters.push(function(coupon){
      var searchTerm = this.state.zipDisplay;
      if(searchTerm == "")
        return false;
      return (coupon.zip && coupon.zip.includes(searchTerm));
    }.bind(this));

    filters.push(function(coupon){
      return (coupon.date >= Date.now());
    }.bind(this));

    return (
      <div className="discover-container">
        <TopBar selected={2} navBarOn={true} history={this.props.history}/>
        <Container>
            <Row>
              <Col xs={5} sm={5}>
              <h1>Discover</h1>
              </Col>
              <Col xs={7} sm={7}>
                <form onChange={this.onChange} className="zipForm">
                  <FormGroup>
                    <InputGroup>
                      <Input type="text" value={this.state.value} onChange={this.onChange} placeholder="Enter Zipcode"/>
                      <InputGroupAddon onClick={this.onSubmit} className="zipForm"><Icon icon={ic_search}/></InputGroupAddon>
                    </InputGroup>
                  </FormGroup>
                </form>
              </Col>
            </Row>
            {
              (this.state.zipDisplay != "") &&
                <h4>Coupons for {this.state.zipDisplay} </h4>
            }
            {
              (this.state.zipDisplay == "") &&
                <p><em>Begin discovering local coupons by entering a Zipcode!</em></p>
            }

          <CouponData
            cols={2}
            filters={filters}
            discoverCoupons
          />
        </Container>
      </div>
    )
    }
}

module.exports = Discover;
