var React = require('react');
var TopBar = require('./TopBar');
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from "react-redux";
var api = require('../utils/api');

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

@connect((store) => {
  return {
    userProfile: store.user
  }
})
class ShoppingList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coupons: [],
      couponsSet: false,
      couponModals:{},
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.couponsSet && this.props.userProfile.loggedIn) {
      var coupons = api.getMarkedCoupons(this.props.userProfile.userID);
      var couponList = [];
      var couponModals = {};
      console.log(coupons);
      for (var userID in coupons) {
        couponList.push({
          id: userID,
          savings: coupons[userID].savings,
          store: coupons[userID].store,
          date: coupons[userID].date,
          category: coupons[userID].category,
          location: coupons[userID].location,
          used: coupons[userID].used,
        })
        couponModals[userID] = false;
      }
      this.setState({
        coupons: couponList,
        couponModals: couponModals,
        couponsSet: true,
      })
    }
  }

  componentDidMount(){
    if (!this.state.couponsSet && this.props.userProfile.loggedIn) {
      var coupons = api.getMarkedCoupons(this.props.userProfile.userID);
      var couponList = [];
      var couponModals = {};
      for (var userID in coupons) {
        couponList.push({
          id: userID,
          savings: coupons[userID].savings,
          store: coupons[userID].store,
          date: coupons[userID].date,
          category: coupons[userID].category,
          location: coupons[userID].location,
          used: coupons[userID].used,
        })
        couponModals[userID] = false;
      }
      this.setState({
        coupons: couponList,
        couponModals: couponModals,
        couponsSet: true,
      })
    }
  }

  toggleModal(userID, toggle) {
    var couponModals = JSON.parse(JSON.stringify(this.state.couponModals));
    for (var id in couponModals) {
      couponModals[id] = false;
    }
    couponModals[userID] = toggle;
    this.setState({
      couponModals: couponModals,
    })
  }

  // convert coupon data to proper n x m array
  nColumnize(n, couponDataArr) {
    var columnCouponData = [];
    for (var i = 0; i < couponDataArr.length / n; i++) {
      var singleRow = [];
      for (var j = 0; j < n; j++) {
        var couponData = couponDataArr[i * n + j];
        if (couponData != undefined) {
          singleRow.push(couponData);
        }
      }
      columnCouponData.push(singleRow);
    }
    return columnCouponData;
  }

  render() {
    // now a 2 x n array because there are 2 coupons per row
    var couponsPerRow = 2;
    var columnCouponData = this.nColumnize(couponsPerRow, couponData);

    // now a 2 x n array because there are 2 coupons per row
    var couponsPerRow = 2;
    var columnCouponData = this.nColumnize(couponsPerRow, this.state.coupons);

    //convert coupon data into component
    var couponComponents = columnCouponData.map(function(couponRow, i) {
      // create component card for single coupon
      var singleRowComponent = couponRow.map(function(coupon, j) {
        var id = coupon.id;
        return (
          <Col xs={(12 / couponsPerRow) + ""} key={j}>
            <Card body onClick={() => {this.toggleModal(id, true)}}>
              <CardTitle>{coupon.savings}</CardTitle>
              <CardSubtitle>{coupon.store}</CardSubtitle>
              <CardText>Exp. {coupon.date}</CardText>
            </Card>
          </Col>)
      }.bind(this));

      return (
        <Row key={i}>
          {singleRowComponent}
        </Row>
      )
    }.bind(this));

    var couponModals = this.state.coupons.map(function(coupon, i) {
      var id = coupon.id;
      return (
        <Modal key={i} isOpen={this.state.couponModals[id]} toggle={() => {this.toggleModal(id, false)}}>
          <ModalHeader toggle={() => {this.toggleModal(id, false)}}>{coupon.savings}</ModalHeader>
          <ModalBody>
            Store: {coupon.store}
          </ModalBody>
          <ModalBody>
            Expiration Date: {coupon.date}
          </ModalBody>
          <ModalBody>
            location: {coupon.location}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => {
                api.markCoupon(this.props.userProfile.userID, id, true);
                this.toggleModal(id, false);
              }}>Use Coupon</Button>
            <Button color="secondary" onClick={() => {this.toggleModal(id, false)}}>Cancel</Button>
          </ModalFooter>
        </Modal>
      )
    }.bind(this));

    return (
      <div name="shopping-list-container">
        <TopBar selected={2} navBarOn={true} history={this.props.history}/>
        <Container>
          <h1>Shopping List</h1>
          {couponComponents}
        </Container>
      </div>
    )
  }
}

module.exports = ShoppingList;
