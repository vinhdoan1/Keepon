var React = require('react');
var TopBar = require('./TopBar');
import { Container, Row, Col } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText, InputGroup, InputGroupButton } from 'reactstrap';
var api = require('../utils/api');
import { connect } from "react-redux";
import { editcoupondone } from "../actions/";
import ReactGA from 'react-ga';
ReactGA.initialize('UA-110103238-1');
ReactGA.pageview(window.location.pathname + window.location.search);

var defaultState1 = {
  store: "",
  date: "",
  location: "",
};

var defaultState2 = {
  zip: "",
  discoverLocation: "",
}

@connect((store) => {
  return {
    userProfile: store.user,
    couponToEdit: store.coupon
  }
})
class AddCoupon2 extends React.Component {
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
        picture: coupon.picture,
        isPicture: coupon.isPicture,
        errorMessage: "",
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
        picture: "",
        isPicture: false,
        errorMessage: "",
      };
    }

    this.onFormChange = this.onFormChange.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onUploadPress = this.onUploadPress.bind(this);
    this.onCancelImagePress = this.onCancelImagePress.bind(this);
  }

  componentDidMount() {
    ReactGA.ga('send', 'event', 'page', 'visit', 'Add Coupon 2');
  }

  componentWillUnmount() {
    this.props.dispatch(editcoupondone());
  }

  onUploadPress() {
    document.getElementById('pictureForm').click();
  }

  onCancelImagePress() {
    this.setState({
      isPicture: false,
      picture: "",
    })
  }

  onFormChange(e) {
    //e.preventDefault();
    if (e.target.name == "discoverable") {
      this.setState({["discoverable"]: !this.state.discoverable});
    } else if (e.target.name == "picture") {
      let reader = new FileReader();
      let file = e.target.files[0];
      reader.onloadend = () => {
        var image = document.createElement("img");
        image.src = reader.result;
        image.onload = function(){
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0);
          var MAX_WIDTH = 300;
          var MAX_HEIGHT = 300;
          var width = image.width;
          var height = image.height;
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0, width, height);

          var dataurl = canvas.toDataURL("image/png");
          this.setState({
            isPicture: true,
            picture: dataurl,
          });
        }.bind(this);
      }
      reader.readAsDataURL(file)
    }
    else {
      this.setState({[e.target.name]: e.target.value});
    }
  }

  onCancel() {
    this.props.dispatch(editcoupondone());
    this.props.history.push({
      pathname: '/home',
    });
  }

  onSubmit() {
    if (this.state.isPicture) {
      if (this.state.picture == "") {
        this.setState({errorMessage: "Please fill out all fields."});
        return;
      }
    }else if (this.state.savings == ""){
      this.setState({errorMessage: "Please fill out all fields."});
      return;
    }

    for (var key in defaultState1) {
      if (defaultState1[key] == this.state[key]) {
        this.setState({errorMessage: "Please fill out all fields."});
        return;
      }
    }

    if (this.state.discoverable) {
      for (key in defaultState2) {
        if (defaultState2[key] == this.state[key]) {
          this.setState({errorMessage: "Please fill out all fields."});
          return;
        }
      }
    }
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
        this.state.isPicture,
        this.state.picture,
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
        this.state.isPicture,
        this.state.picture,
      )
      if (!this.state.isPicture) {
        ReactGA.ga('send', 'event', 'button', 'click', 'Added Coupon with no picture');
      } else {
        ReactGA.ga('send', 'event', 'button', 'click', 'Added Coupon with picture');
      }
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
        this.state.isPicture,
        this.state.picture,
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
      <div className="add-coupon-2-container">
        <TopBar selected={0} navBarOn={true} history={this.props.history}/>
        <Container>
          <h1>{headerText}</h1>
          <Form onChange={this.onFormChange}>
            <FormGroup>
              <Label for="savingsForm">Enter Savings</Label>
              <Input name="savings" id="savingsForm" placeholder="Describe your deal" value={this.state.savings}/>
            </FormGroup>
            <FormGroup>
              <Label for="pictureForm">Or Upload Coupon Image</Label>
              <Input type="file" name="picture" id="pictureForm" accept="image/gif, image/jpeg, image/png"/>
              <div className="imageButtonsGroup">
                <Button className="imageButtons" onClick={this.onUploadPress}>Upload</Button>
                {
                  (this.state.isPicture) &&
                  <Button className="imageButtons" onClick={this.onCancelImagePress}>Cancel</Button>
                }
              </div>
              <img className="imageDisplay" src={this.state.picture}></img>
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
              <p><sup>*Adds coupon to public database for anyone to discover!</sup></p>
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
          <p className="errorMessage">{this.state.errorMessage}</p>
          <div className="add-coupon-buttons">
            <Button onClick={this.onCancel} className="addCouponButton">Cancel</Button>
            <Button onClick={this.onSubmit} className="addCouponButton">Submit</Button>
          </div>
        </Container>
      </div>
    )
  }
}

module.exports = AddCoupon2;
