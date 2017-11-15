/*
Represents the display of the grid of coupons. The passed in props can specify
the the number of columns, how to filter them

Check the bottom for the full list of prop types
*/

var React = require('react');
var PropTypes = require('prop-types');
import { Container, Row, Col } from 'reactstrap';
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from "react-redux";
var api = require('../utils/api');

@connect((store) => {
  return {
    userProfile: store.user
  }
})
class CouponData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coupons: [],
      couponsSet: false,
      couponModals:{},
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  refreshCouponList() {
    var coupons = []
    if (this.props.shoppingList) {
      coupons = api.getMarkedCoupons(this.props.userProfile.userID);
    } else if (this.props.discoverCoupons) {
      coupons = api.getDiscoverCoupons();
    }
    else {
      coupons = api.getCoupons(this.props.userProfile.userID);
    }
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
        zip: coupons[userID].zip,
        dateAdded: coupons[userID].dateAdded,
      })
      couponModals[userID] = false;
    }
    this.setState({
      coupons: couponList,
      couponModals: couponModals,
      couponsSet: true,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.couponsSet && this.props.userProfile.loggedIn) {
      this.refreshCouponList();
    }
  }

  componentDidMount(){
    if (!this.state.couponsSet && this.props.userProfile.loggedIn) {
      this.refreshCouponList();
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

  // get sorting function
  getSortFunction(sortType) {
    if (sortType == 0) { // expiration date
      return (function (a,b) {
        if (a.date < b.date)
        return -1;
        if (a.date > b.date)
        return 1;
        return 0;
      });
    } else if (sortType == 1) { // date added
      return (function (a,b) {
        if (a.dateAdded > b.dateAdded)
        return -1;
        if (a.dateAdded < b.dateAdded)
        return 1;
        return 0;
      });
    } else if (sortType == 2) { // store (a-z)
      return (function (a,b) {
        if (a.store < b.store)
        return -1;
        if (a.store > b.store)
        return 1;
        return 0;
      });
    }
  }

  getDateString(isoVal) {
    var date = new Date(0);
    date.setUTCMilliseconds(isoVal);
    return date.toLocaleDateString();
  }

  render() {

    // now a cols x n array because there are (cols) coupons per row
    var couponsPerRow = this.props.cols;

    var filteredData = this.state.coupons.slice();
    for (var i = 0; i < this.props.filters.length; i++) {
      filteredData = filteredData.filter(this.props.filters[i]);
    }

    if (this.props.sortFunc) {
      filteredData = filteredData.sort(this.getSortFunction(this.props.sortFunc));
    } else {
      filteredData = filteredData.sort(this.getSortFunction(0));
    }

    var columnCouponData = this.nColumnize(couponsPerRow, filteredData);

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
              <CardText>{"Exp. " + this.getDateString(coupon.date)}</CardText>
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
      var couponModalButtons;
      if (this.props.buttons) {
        couponModalButtons = this.props.buttons.map(function(button, j) {
          return <Button key={j} color={button.buttonColor} onClick={() => {
              button.buttonFunc(this.props.userProfile.userID, id);
              this.refreshCouponList();
              this.toggleModal(id, false);
            }}>{button.buttonText}</Button>
        }.bind(this));
      }

      return (
        <Modal key={i} isOpen={this.state.couponModals[id]} toggle={() => {this.toggleModal(id, false)}}>
          <ModalHeader toggle={() => {this.toggleModal(id, false)}}>{coupon.savings}</ModalHeader>
          <ModalBody>
            Store: {coupon.store}
          </ModalBody>
          <ModalBody>
            Expiration Date: {this.getDateString(coupon.date)}
          </ModalBody>
          <ModalBody>
            Date Added: {this.getDateString(coupon.dateAdded)}
          </ModalBody>
          <ModalBody>
            Category: {coupon.category}
          </ModalBody>
          <ModalBody>
            Location: {coupon.location}
          </ModalBody>
          <ModalFooter>
            {couponModalButtons}
            <Button color="secondary" onClick={() => {this.toggleModal(id, false)}}>Cancel</Button>
          </ModalFooter>
        </Modal>
      )
    }.bind(this));

    return (
      <div name="coupon-data-container">
          {couponModals}
          {couponComponents}
      </div>
    )
  }
}

// different prop types
CouponData.propTypes = {
  cols: PropTypes.number.isRequired, // how many columns
  filters: PropTypes.arrayOf(PropTypes.func), // which filter functions are applied
  sort: PropTypes.func, // which sort function is applied
  buttons: PropTypes.arrayOf(PropTypes.shape({ // buttons and thier function
    buttonText: PropTypes.string,
    buttonColor: PropTypes.string, // color of button
    buttonFunc: PropTypes.func, // takes in userID and couponID
  })),
  shoppingList: PropTypes.bool, // whether it is a shopping list or not
  discoverCoupons: PropTypes.bool, // whether it is a discoverCoupons
  sortFunc: PropTypes.number, // function for sort
};

module.exports = CouponData;
