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

    // filter that looks at the search term
    filters.push(function(coupon) {
      var searchTerm = this.state.searchTerm;
      if (searchTerm == "")
        return true;
      return coupon.savings.includes(searchTerm) || coupon.store.includes(searchTerm) || coupon.category.includes(searchTerm);
    }.bind(this));

    filters.push(function(coupon) {
      return !coupon.used;
    });

    var buttons = [];


    /*
    var addToShoppingListFunc = function(userID, coupon) {

    }
    buttons.push{
      buttonText: "Add to Shopping List",
      buttonFunc:

    }

    <Button color="primary" onClick={() => {
        api.addCouponToShoppingList(this.props.userProfile.userID, id);
        this.toggleModal(id, false);
      }}>Add to Shopping List</Button>
      <Button color="primary" onClick={() => {
          api.markCoupon(this.props.userProfile.userID, id, true);
          this.refreshCouponList();
          this.toggleModal(id, false);
        }}>Use Coupon</Button>
        */

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
            />
        </Container>
      </div>
    )
  }
}

module.exports = Home;
