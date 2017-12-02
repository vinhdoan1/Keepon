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
import ReactGA from 'react-ga';
ReactGA.initialize('UA-110103238-1');
ReactGA.pageview(window.location.pathname + window.location.search);

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
    this.getDateString = this.getDateString.bind(this);
    this.createCouponCards = this.createCouponCards.bind(this);
    this.stylizeColsWithMonths = this.stylizeColsWithMonths.bind(this);
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
        isPicture: coupons[userID].isPicture,
        picture: coupons[userID].picture,
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

  createCouponCards(columnCouponData, couponsPerRow) {
    return columnCouponData.map(function(couponRow, i) {
      // create component card for single coupon
      var singleRowComponent = couponRow.map(function(coupon, j) {
        var id = coupon.id;
        var couponCardClass = ""
        if (coupon.date < Date.now()){
          couponCardClass += "expired ";
        }
        if (coupon.date < Date.now() + 7*86400000 ) {
          couponCardClass += "expiringSoon";
        }
        return (
          <Col xs={(12 / couponsPerRow) + ""} key={j}>
            <Card body onClick={() => {this.toggleModal(id, true)}} className={couponCardClass}>
              <CardTitle>
                {(coupon.isPicture) && "Coupon Image"}
                {(!coupon.isPicture) && coupon.savings}
              </CardTitle>
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
  }


  stylizeColsWithMonths(couponsPerRow, data) {
    if (data.length <= 0)
      return this.nColumnize(couponsPerRow, data);

    var prevDate = new Date(0);
    prevDate.setUTCMilliseconds(data[0].date);
    var prevMonth = prevDate.getMonth();
    var prevYear = prevDate.getYear();

    var monthDates = [];
    var couponsMonths = [];

    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    for (var i = 0; i < data.length; i++) {
      var date = new Date(0);
      date.setUTCMilliseconds(data[i].date);
      var dateMonth = date.getMonth();
      var dateYear = date.getYear();
      if (prevMonth != dateMonth || prevYear != dateYear) {
        couponsMonths.push({
          dates: (monthDates.slice()),
          name: (monthNames[prevMonth] + " " + (prevYear + 1900)),
        });
        prevMonth = dateMonth;
        prevYear = dateYear;
        monthDates.length = 0;
      }
      monthDates.push(data[i]);
    }

    couponsMonths.push({
      dates: (monthDates.slice()),
      name: (monthNames[prevMonth] + " " + (prevYear + 1900)),
    });

    return couponsMonths.map(function(couponMonth, i) {
        var couponComponent = this.createCouponCards(this.nColumnize(couponsPerRow, couponMonth.dates), couponsPerRow);
        return(
          <div key={i}>
            <h4>{couponMonth.name}</h4>
            {couponComponent}
          </div>
        );
    }.bind(this));
  }

  stylizeColsWithMonths(couponsPerRow, data, dateType) {
    if (data.length <= 0)
      return (<div></div>);

    var prevDate = new Date(0);
    prevDate.setUTCMilliseconds(data[0][dateType]);
    var prevMonth = prevDate.getMonth();
    var prevYear = prevDate.getYear();

    var monthDates = [];
    var couponsMonths = [];

    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    for (var i = 0; i < data.length; i++) {
      var date = new Date(0);
      date.setUTCMilliseconds(data[i][dateType]);
      var dateMonth = date.getMonth();
      var dateYear = date.getYear();
      if (prevMonth != dateMonth || prevYear != dateYear) {
        couponsMonths.push({
          dates: (monthDates.slice()),
          name: (monthNames[prevMonth] + " " + (prevYear + 1900)),
        });
        prevMonth = dateMonth;
        prevYear = dateYear;
        monthDates.length = 0;
      }
      monthDates.push(data[i]);
    }

    couponsMonths.push({
      dates: (monthDates.slice()),
      name: (monthNames[prevMonth] + " " + (prevYear + 1900)),
    });

    return couponsMonths.map(function(couponMonth, i) {
        var couponComponent = this.createCouponCards(this.nColumnize(couponsPerRow, couponMonth.dates), couponsPerRow);
        return(
          <div key={i}>
            <h4>{couponMonth.name}</h4>
            {couponComponent}
          </div>
        );
    }.bind(this));
  }

  stylizeColsWithNames(couponsPerRow, data) {
    if (data.length <= 0)
      return (<div></div>);

    var prevStore = data[0].store;

    var storeCoupons = [];
    var couponsAllStores = [];

    for (var i = 0; i < data.length; i++) {
      var currStore = data[i].store;
      if (prevStore != currStore) {
        couponsAllStores.push({
          coupons: (storeCoupons.slice()),
          name: prevStore,
        });
        prevStore = currStore;
        storeCoupons.length = 0;
      }
      storeCoupons.push(data[i]);
    }

    couponsAllStores.push({
      coupons: (storeCoupons.slice()),
      name: prevStore,
    });

    return couponsAllStores.map(function(couponStore, i) {
        var couponComponent = this.createCouponCards(this.nColumnize(couponsPerRow, couponStore.coupons), couponsPerRow);
        return(
          <div key={i}>
            <h4>{couponStore.name}</h4>
            {couponComponent}
          </div>
        );
    }.bind(this));
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



    var couponComponents;
    if (this.props.categorize) {
        switch(this.props.sortFunc) {
            case 1:
                couponComponents = this.stylizeColsWithMonths(couponsPerRow, filteredData, "dateAdded");
                break;
            case 2:
                couponComponents = this.stylizeColsWithNames(couponsPerRow, filteredData);
                break;
            default:
                couponComponents = this.stylizeColsWithMonths(couponsPerRow, filteredData, "date");
        }
    } else {
      var columnCouponData = this.nColumnize(couponsPerRow, filteredData);
      couponComponents = this.createCouponCards(columnCouponData, couponsPerRow);
    }

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
          <ModalHeader toggle={() => {this.toggleModal(id, false)}}>
            {(coupon.isPicture) && "Coupon Image"}
            {(!coupon.isPicture) && coupon.savings}
          </ModalHeader>
          {
            (coupon.isPicture) &&
            <ModalBody>
              <img className="couponModalPicture" src={coupon.picture}></img>
            </ModalBody>
          }
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
            Location: {coupon.location}
          </ModalBody>
          <ModalFooter className="modalButtons">
            {couponModalButtons}
            <Button color="secondary" onClick={() => {this.toggleModal(id, false)}}>Cancel</Button>
          </ModalFooter>
        </Modal>
      )
    }.bind(this));

    return (
      <div className="coupon-data-container">
          {couponModals}
          {couponComponents}
          {
            (this.props.addCouponText && this.state.coupons.length <= 0) &&
            <p><em>No coupons have been added yet! Add your first coupon with the <strong>Add Coupon</strong> button above!</em></p>
          }
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
  categorize: PropTypes.bool, // whether to categorize coupons
  addCouponText: PropTypes.bool, // whether to include text to add coupon if there are none
};

module.exports = CouponData;
