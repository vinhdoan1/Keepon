var React = require('react');
var TopBar = require('./TopBar');
import { Container, Row, Col } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
var api = require('../utils/api');
import { connect } from "react-redux";
import { editcoupondone } from "../actions/";

@connect((store) => {
  return {
    userProfile: store.user,
    couponToEdit: store.coupon
  }
})
class AddCoupon extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.couponToEdit.editing) {
      var coupon = api.getSingleCoupon(this.props.userProfile.userID, this.props.couponToEdit.couponID);
      var date = 0;
      if (coupon.category) {
        date = coupon.category;
      }
      this.state = {
        savings: coupon.savings,
        store: coupon.store,
        date: coupon.date,
        category: coupon.category,
        location: coupon.location,
        discoverable: coupon.discoverable,
        zip: coupon.zip,
        discoverLocation: coupon.discoverLocation,
      };
    } else {
      this.state = {
        savings: "",
        store: "",
        date: "",
        category: "",
        location: "",
        discoverable: false,
        zip: "",
        discoverLocation: "",
      };
    }

    this.onFormChange = this.onFormChange.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onFormChange(e) {
    //e.preventDefault();
    if (e.target.name != "discoverable") {
      this.setState({[e.target.name]: e.target.value});
    } else {
      this.setState({["discoverable"]: !this.state.discoverable})
    }
  }

  onCancel() {
    this.props.dispatch(editcoupondone());
    this.props.history.push({
      pathname: '/home',
    });
  }

  onSubmit() {
    var date = new Date(this.state.date);
    var dateUTC = date.getTime();
    var dateAdded = Date.now();
    if (this.props.couponToEdit.editing) {
      api.editCoupon(
        this.props.userProfile.userID,
        this.props.couponToEdit.couponID,
        this.state.savings,
        this.state.store,
        dateUTC,
        this.state.category,
        this.state.location,
        this.state.discoverable,
        this.state.zip,
        this.state.discoverLocation,
        dateAdded,
      )
    } else {
      api.addCoupon(
        this.props.userProfile.userID,
        this.state.savings,
        this.state.store,
        dateUTC,
        this.state.category,
        this.state.location,
        this.state.discoverable,
        this.state.zip,
        this.state.discoverLocation,
        dateAdded,
      )
    }
    if (this.state.discoverable) {
      api.addCouponToDiscoverable(
        this.state.savings,
        this.state.store,
        this.state.date,
        this.state.category,
        this.state.location,
        this.state.zip,
        this.state.discoverLocation,
        dateAdded,
      )
    }
    this.props.dispatch(editcoupondone());
    this.props.history.push({
      pathname: '/home',
    });
  }

  render() {
    var headerText = "Add Coupon";
    if (this.props.couponToEdit.editing) {
      headerText = "Edit Coupon";
    }

    return (
      <div className="add-coupon-container">
        <TopBar selected={0} navBarOn={true} history={this.props.history}/>
        <Container>
          <h1>{headerText}</h1>
          <Form onChange={this.onFormChange}>
            <FormGroup>
              <Label for="savingsForm">Savings</Label>
              <Input name="savings" id="savingsForm" placeholder="Describe your deal" value={this.state.savings}/>
            </FormGroup>
            <FormGroup>
              <Label for="storeForm">Store</Label>
              <Input name="store" id="storeForm" placeholder="ex. Vons, Target, Best Buy" value={this.state.store}/>
            </FormGroup>
            <FormGroup>
              <Label for="dateForm">Expiration Date</Label>
              <Input type="date" name="date" id="dateForm" value={this.state.date}/>
            </FormGroup>
            <FormGroup>
              <Label for="locationForm">Where is the Coupon Stored?</Label>
              <Input name="location" id="locationForm" placeholder="ex: Wallet, Coupon Drawer, Pocket" value={this.state.location}/>
            </FormGroup>
            <FormGroup>
              <Label for="discoverableCheckBox">Make Discoverable?</Label>
              <Input type="checkbox" id="discoverableBox" name="discoverable" value={this.state.discoverable}/>
            </FormGroup>
            <FormGroup>
              <Label for="zipForm">ZIP Code:</Label>
              <Input disabled={!this.state.discoverable} name="zip" id="zipForm" placeholder="Enter ZIP Code (leave blank if universal)" value={this.state.zip}/>
            </FormGroup>
            <FormGroup>
              <Label for="discoverLocationForm">Enter Coupon Location:</Label>
              <Input disabled={!this.state.discoverable} name="discoverLocation" id="discoverLocationForm" placeholder="ex: LA Times, pg. 1" value={this.state.discoverLocation}/>
            </FormGroup>

          </Form>
          <Button onClick={this.onCancel} className="addCouponButton">Cancel</Button>
          <Button onClick={this.onSubmit} className="addCouponButton">Submit</Button>
        </Container>
      </div>
    )
  }
}

module.exports = AddCoupon;
