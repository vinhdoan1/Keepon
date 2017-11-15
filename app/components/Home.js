var React = require('react');
var TopBar = require('./TopBar');
var CouponData = require('./CouponData');
import { Container, Row, Col } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText, InputGroup, InputGroupAddon } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { ListGroup, ListGroupItem } from 'reactstrap';
import Icon from 'react-icons-kit';
import { ic_search } from 'react-icons-kit/md/ic_search';
import { connect } from "react-redux";

@connect((store) => {
  return {
  }
})
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      sortModal: false,
      sortType: 0,
    };

    this.onSearchChange = this.onSearchChange.bind(this);
    this.toggleSortModal = this.toggleSortModal.bind(this);
    this.setSortType = this.setSortType.bind(this);
  }

  onSearchChange(e) {
    this.setState({
      searchTerm: e.target.value,
    })
  }

  toggleSortModal() {
    this.setState({
      sortModal: !this.state.sortModal,
    })
  }

  setSortType(sortType) {
    this.setState({
      sortType: sortType,
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

    var editCouponFunc = function(userID, couponID) {
      this.props.dispatch(editcoupon(couponID));
      this.props.history.push({
        pathname: '/addcoupon',
      });
    }
    buttons.push({
      buttonText: "Edit Coupon",
      buttonColor: "primary",
      buttonFunc: editCouponFunc,
    });

    var sorts = ['Sort by Expiration Date', 'Sort by Date Added', 'Sort by Store (A-Z)'];
    var sortListGroup = sorts.map(function(sort, i) {
      return <ListGroupItem key={i} tag="button" active={i == this.state.sortType} onClick={() => {
          this.setSortType(i);
          this.toggleSortModal();
        }} action>{sort}</ListGroupItem>
    }.bind(this));

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
                <Button outline color="primary" onClick={this.toggleSortModal}>Sort</Button>
              </Col>
            </Row>
          <CouponData
            cols={2}
            filters={filters}
            buttons={buttons}
            sortFunc={this.state.sortType}
            />
          <Modal isOpen={this.state.sortModal} toggle={this.toggleSortModal}>
              <ModalHeader toggle={this.toggleSortModal}>Sort By:</ModalHeader>
              <ModalBody>
                <ListGroup>
                  {sortListGroup}
                </ListGroup>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={this.toggleSortModal}>Cancel</Button>
              </ModalFooter>
          </Modal>
        </Container>
      </div>
    )
  }
}

module.exports = Home;
