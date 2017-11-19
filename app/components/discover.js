var React = require('react');
var TopBar = require('./TopBar');
var CouponData = require('./CouponData');
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Form, FormGroup, Label, Input, FormText, InputGroup, InputGroupAddon } from 'reactstrap';
import Icon from 'react-icons-kit';
import { ic_search } from 'react-icons-kit/md/ic_search';

class Discover extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      value: undefined,
      zipEntered: undefined,
      zipDisplay: undefined,
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
      var searchTerm = this.state.zipEntered;
      console.log("Search: " + searchTerm);
      if(searchTerm == "")
        return true; 
      return (coupon.zip && coupon.zip.includes(searchTerm));
    }.bind(this));

    return (
      <div name="discover-container">
        <TopBar selected={2} navBarOn={true} history={this.props.history}/>
        <Container>
            <Row>
              <Col xs={6} sm={6}>
              <h1>Discover</h1>
              </Col>
              <Col xs={4} sm={4}>
                <form onChange={this.onChange}>
                  <FormGroup>
                    <Input type="text" value={this.state.value} onChange={this.onChange} placeholder="Enter Zipcode"/>
                  </FormGroup>
                </form>
              </Col>
              <Col xs={2} sm={2}>
                <Button onClick={this.onSubmit}>Enter</Button>
              </Col>
            </Row>
            <h4>Coupons for {this.state.zipDisplay} </h4>
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
