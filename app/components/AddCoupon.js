var React = require('react');
var TopBar = require('./TopBar');
import { Container, Row, Col } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
var api = require('../utils/api');
import { connect } from "react-redux";

@connect((store) => {
  return {
    userProfile: store.user,
    couponToEdit: store.coupon
  }
})
class AddCoupon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      savings: undefined,
      store: undefined,
      date: undefined,
      category: undefined,
      location: undefined,
      discoverable: false,
      zip: undefined,
      discoverLocation: undefined,
    };

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
    this.props.history.push({
      pathname: '/home',
    });
  }

  onSubmit() {
    api.addCoupon(
      this.props.userProfile.userID,
      this.state.savings,
      this.state.store,
      this.state.date,
      this.state.category,
      this.state.location,
      this.state.discoverable,
      this.state.zip,
      this.state.discoverLocation,
    )
    if (this.state.discoverable) {
      api.addCouponToDiscoverable(
        this.state.savings,
        this.state.store,
        this.state.date,
        this.state.category,
        this.state.location,
        this.state.zip,
        this.state.discoverLocation,
      )
    }
    this.props.history.push({
      pathname: '/home',
    });
  }

  render() {
    return (
      <div className="add-coupon-container">
        <TopBar selected={3} navBarOn={true} history={this.props.history}/>
        <Container>
          <h1>Add Coupon</h1>
          <Form onChange={this.onFormChange}>
            <FormGroup>
              <Label for="savingsForm">Savings</Label>
              <Input name="savings" id="savingsForm" placeholder="Describe your deal"/>
            </FormGroup>
            <FormGroup>
              <Label for="storeForm">Store</Label>
              <Input name="store" id="storeForm" placeholder="ex. Vons, Target, Best Buy" />
            </FormGroup>
            <FormGroup>
              <Label for="dateForm">Expiration Date</Label>
              <Input type="date" name="date" id="dateForm" />
            </FormGroup>
            <FormGroup>
              <Label for="categoryForm">Category</Label>
                <Input type="select" name="category" id="categoryForm" defaultValue="default">
                    <option disabled value="default">Select Catergory</option>
                    <option>Clothes</option>
                    <option>Electronics</option>
                    <option>Entertainment</option>
                    <option>Food</option>
                    <option>Furniture</option>
                    <option>Office</option>
                    <option>Sports</option>
                </Input>
            </FormGroup>
            <FormGroup>
              <Label for="locationForm">Where is the Coupon Stored?</Label>
              <Input name="location" id="locationForm" placeholder="ex: Wallet, Coupon Drawer, Pocket"/>
            </FormGroup>
            <FormGroup>
              <Label for="discoverableCheckBox">Make Discoverable?</Label>
              <Input type="checkbox" id="discoverableBox" name="discoverable"/>
            </FormGroup>
            <FormGroup>
              <Label for="zipForm">ZIP Code:</Label>
              <Input disabled={!this.state.discoverable} name="zip" id="zipForm" placeholder="Enter ZIP Code (leave blank if universal)" />
            </FormGroup>
            <FormGroup>
              <Label for="discoverLocationForm">Enter Coupon Location:</Label>
              <Input disabled={!this.state.discoverable} name="discoverLocation" id="discoverLocationForm" placeholder="ex: LA Times, pg. 1" />
            </FormGroup>

          </Form>
          <Button onClick={this.onCancel}>Cancel</Button>
          <Button onClick={this.onSubmit}>Submit</Button>
        </Container>
      </div>
    )
  }
}

module.exports = AddCoupon;
