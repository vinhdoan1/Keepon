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
import { editcoupon } from "../actions/";
var api = require('../utils/api');
var ab = require('../utils/ab');
import ReactGA from 'react-ga';
ReactGA.initialize('UA-110103238-1');
ReactGA.pageview(window.location.pathname + window.location.search);

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

    var searchTermCaps = this.state.searchTerm.toUpperCase();
    // filter that looks at the search term
    filters.push(function(coupon) {

      if (searchTermCaps == "")
        return true;
      return (coupon.savings && coupon.savings.toUpperCase().indexOf(searchTermCaps) == 0) ||
       (coupon.store && coupon.store.toUpperCase().indexOf(searchTermCaps) == 0)
      }.bind(this));

    var buttons = [];

    /*
    var addToShoppingListFunc = function(userID, couponID) {
      api.addCouponToShoppingList(userID, couponID);
    }
    buttons.push({
      buttonText: "Add to Shopping List",
      buttonFunc: addToShoppingListFunc,
      buttonColor: "primary",
    })
    */

    var markCouponFunc = function(userID, couponID) {
      api.markCoupon(userID, couponID, true);
    }
    buttons.push({
      buttonText: "Use Coupon",
      buttonColor: "secondary",
      buttonFunc: markCouponFunc,
    });

    var editCouponFunc = function(userID, couponID) {
      var coupon = {
        id: couponID,
      }
      var loc = '/addcoupon';
      if (ab.getExperiment()) {
        loc += '2'
      }
      this.props.dispatch(editcoupon(coupon));
      this.props.history.push({
        pathname: loc,
      });
    }.bind(this);

    buttons.push({
      buttonText: "Edit Coupon",
      buttonColor: "secondary",
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
        <TopBar selected={1} navBarOn={true} history={this.props.history}/>
        <Container>
            <h1>My Coupons</h1>
            <Row>
              <Col xs={9} sm={10}>
                <FormGroup onChange={this.onSearchChange}>
                  <InputGroup>
                    <InputGroupAddon><Icon icon={ic_search}/></InputGroupAddon>
                    <Input placeholder="Search" />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col xs={3} sm={2}>
                <Button color="secondary" onClick={this.toggleSortModal}>Sort</Button>
              </Col>
            </Row>
          <CouponData
            cols={2}
            filters={filters}
            buttons={buttons}
            sortFunc={this.state.sortType}
            categorize
            addCouponText
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
