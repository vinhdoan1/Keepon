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


class Home extends React.Component {

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

  render() {
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
      <div name="login-container">
        <TopBar selected={1} navBarOn={true} history={this.props.history}/>
        <Container>
            <h1>My Coupons</h1>
            <Row>
              <Col xs={8} sm={10}>
                <FormGroup>
                  <InputGroup>
                    <InputGroupAddon><Icon icon={ic_search}/></InputGroupAddon>
                    <Input placeholder="Search" />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col xs={2} sm={1}>
                <Button outline color="primary">Filter</Button>
              </Col>
              <Col xs={2} sm={1}>
                <Button outline color="primary">Sort</Button>
              </Col>
            </Row>
          {couponComponents}
        </Container>
      </div>
    )
  }
}

module.exports = Home;
