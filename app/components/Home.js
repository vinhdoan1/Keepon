var React = require('react');
var TopBar = require('./TopBar');
var CouponData = require('./CouponData');
import { Container, Row, Col } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText, InputGroup, InputGroupAddon } from 'reactstrap';
import Icon from 'react-icons-kit';
import { ic_search } from 'react-icons-kit/md/ic_search';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
    };

    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onSearchChange(e) {
    this.setState({
      searchTerm: e.target.value,
    })
  }

  render() {
    var filters = [];

    filters.push(function(coupon) {
      return !coupon.used;
    });

    // filter that looks at the search term
    filters.push(function(coupon) {
      var searchTerm = this.state.searchTerm;
      if (searchTerm == "")
        return true;
        console.log(coupon);
      return (coupon.savings && coupon.savings.includes(searchTerm)) ||
       (coupon.store && coupon.store.includes(searchTerm)) ||
        (coupon.category && coupon.category.includes(searchTerm));
    }.bind(this));

    var buttons = [];

    var addToShoppingListFunc = function(userID, couponID) {
      api.addCouponToShoppingList(userID, couponID);
    }
    buttons.push({
      buttonText: "Add to Shopping List",
      buttonFunc: addToShoppingListFunc,
      buttonColor: "primary",
    })

    var markCouponFunc = function(userID, couponID) {
      api.markCoupon(userID, couponID, true);
    }
    buttons.push({
      buttonText: "Use Coupon",
      buttonColor: "primary",
      buttonFunc: markCouponFunc,
    });


    return (
      <div name="login-container">
        <TopBar selected={0} navBarOn={true} history={this.props.history}/>
        <Container>
            <h1>My Coupons</h1>
            <Row>
              <Col xs={10} sm={10}>
                <FormGroup onChange={this.onSearchChange}>
                  <InputGroup>
                    <InputGroupAddon><Icon icon={ic_search}/></InputGroupAddon>
                    <Input placeholder="Search" />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col xs={2} sm={2}>
                <Button outline color="primary">Sort</Button>
              </Col>
            </Row>
          <CouponData
            cols={2}
            filters={filters}
            buttons={buttons}
            />
        </Container>
      </div>
    )
  }
}

module.exports = Home;
