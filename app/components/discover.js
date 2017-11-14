var React = require('react');
var TopBar = require('./TopBar');
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Form, FormGroup, Label, Input, FormText, InputGroup, InputGroupAddon } from 'reactstrap';
import Icon from 'react-icons-kit';
import { ic_search } from 'react-icons-kit/md/ic_search';

var couponData = [
  {
    name: "$20 off Fried Chicken",
    store: "Vons",
    expiration: "10/28/17",
  },
  {
    name: "$15 off when you buy two or more hats",
    store: "Macy's",
    expiration: "10/28/17",
  },
  {
    name: "10% off Purchase",
    store: "Bed, Bath, and Beyond",
    expiration: "10/28/17",
  },
  {
    name: "$2.50 off Breakfast Sandwich",
    store: "Mcdonald's",
    expiration: "10/28/17",
  },
  {
    name: "$500 off LED Television",
    store: "Fry's Electronics",
    expiration: "10/28/17",
  },
  {
    name: "50% off One Item",
    store: "Best Buy",
    expiration: "10/28/17",
  },
]

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
    console.log("Working");
  }

// convert coupon data to proper n x m array
  nColumnize(n, couponDataArr) {
    var columnCouponData = [];
    for (var i = 0; i < couponDataArr.length / n; i++) {
      var singleRow = [];
      for (var j = 0; j < n; j++) {
        singleRow.push(couponDataArr[i * n + j]);
      }
      columnCouponData.push(singleRow);
    }
    return columnCouponData;
  }

  render(){
            // now a 2 x n array because there are 2 coupons per row
    var couponsPerRow = 2;
    var columnCouponData = this.nColumnize(couponsPerRow, couponData);

    //convert coupon data into component
    var couponComponents = columnCouponData.map(function(couponRow, i) {
      // create component card for single coupon
      var singleRowComponent = couponRow.map(function(coupon, j) {
        return (
          <Col xs={(12 / couponsPerRow) + ""} key={j}>
            <Card body>
              <CardTitle>{coupon.name}</CardTitle>
              <CardSubtitle>{coupon.store}</CardSubtitle>
              <CardText>Exp. {coupon.expiration}</CardText>
            </Card>
          </Col>)
      });

    return (
        <Row key={i}>
          {singleRowComponent}
        </Row>
      )
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
          {couponComponents}
        </Container>
      </div>
    )
    }
}

module.exports = Discover;
