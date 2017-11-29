var React = require('react');
var TopBar = require('./TopBar');
var CouponData = require('./CouponData');
import { Container, Row, Col } from 'reactstrap';
var api = require('../utils/api');
import ReactGA from 'react-ga';
ReactGA.initialize('UA-110103238-1');
ReactGA.pageview(window.location.pathname + window.location.search);

class ShoppingList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    var filters = [];

    // filter that removes used coupons
    filters.push(function(coupon) {
      return !coupon.used;
    });

    var buttons = [];

    var markCouponFunc = function(userID, couponID) {
      api.markCoupon(userID, couponID, true);
    }
    buttons.push({
      buttonText: "Use Coupon",
      buttonColor: "primary",
      buttonFunc: markCouponFunc,
    });


    return (
      <div name="shopping-list-container">
        <TopBar selected={1} navBarOn={true} history={this.props.history}/>
        <Container>
          <h1>Shopping List</h1>
          <p>Add coupons to your Shopping List for quick and easy access!</p>
          <CouponData
            cols={2}
            filters={filters}
            buttons={buttons}
            shoppingList
            />
        </Container>
      </div>
    )
  }
}

module.exports = ShoppingList;
