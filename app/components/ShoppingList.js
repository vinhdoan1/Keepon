var React = require('react');
var TopBar = require('./TopBar');
var CouponData = require('./CouponData');
import { Container, Row, Col } from 'reactstrap';

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

    return (
      <div name="shopping-list-container">
        <TopBar selected={1} navBarOn={true} history={this.props.history}/>
        <Container>
          <h1>Shopping List</h1>
          <p>Add coupons to your Shopping List for quick and easy access!</p>
          <CouponData
            cols={2}
            filters={filters}
            shoppingList
            />
        </Container>
      </div>
    )
  }
}

module.exports = ShoppingList;
