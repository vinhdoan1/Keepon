var React = require('react');
var TopBar = require('./TopBar');
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Form, FormGroup, Label, Input, FormText, InputGroup, InputGroupAddon } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Icon from 'react-icons-kit';
import { ic_search } from 'react-icons-kit/md/ic_search';
import { connect } from "react-redux";
var api = require('../utils/api');

@connect((store) => {
  return {
    userProfile: store.user
  }
})
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coupons: [],
      couponsSet: false,
      couponModals:{},
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.couponsSet && this.props.userProfile.loggedIn) {
      var coupons = api.getCoupons(this.props.userProfile.userID);
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
        })
        couponModals[userID] = false;
      }
      this.setState({
        coupons: couponList,
        couponModals: couponModals,
        couponsSet: true,
      })
    }
  }

  componentDidMount(){
    if (!this.state.couponsSet && this.props.userProfile.loggedIn) {
      var coupons = api.getCoupons(this.props.userProfile.userID);
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
        })
        couponModals[userID] = false;
      }
      this.setState({
        coupons: couponList,
        couponModals: couponModals,
        couponsSet: true,
      })
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

  render() {
    // now a 2 x n array because there are 2 coupons per row
    var couponsPerRow = 2;
    var columnCouponData = this.nColumnize(couponsPerRow, this.state.coupons);

    //convert coupon data into component
    var couponComponents = columnCouponData.map(function(couponRow, i) {
      // create component card for single coupon
      var singleRowComponent = couponRow.map(function(coupon, j) {
        var id = coupon.id;
        return (
          <Col xs={(12 / couponsPerRow) + ""} key={j}>
            <Card body onClick={() => {this.toggleModal(id, true)}}>
              <CardTitle>{coupon.savings}</CardTitle>
              <CardSubtitle>{coupon.store}</CardSubtitle>
              <CardText>Exp. {coupon.date}</CardText>
            </Card>
          </Col>)
      }.bind(this));

      return (
        <Row key={i}>
          {singleRowComponent}
        </Row>
      )
    }.bind(this));

    var couponModals = this.state.coupons.map(function(coupon, i) {
      var id = coupon.id;
      return (
        <Modal key={i} isOpen={this.state.couponModals[id]} toggle={() => {this.toggleModal(id, false)}}>
          <ModalHeader toggle={() => {this.toggleModal(id, false)}}>{coupon.savings}</ModalHeader>
          <ModalBody>
            Store: {coupon.store}
          </ModalBody>
          <ModalBody>
            Expiration Date: {coupon.date}
          </ModalBody>
          <ModalBody>
            location: {coupon.location}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => {
                api.addCouponToShoppingList(this.props.userProfile.userID, id);
                this.toggleModal(id, false);
              }}>Add to Shopping List</Button>
            <Button color="secondary" onClick={() => {this.toggleModal(id, false)}}>Cancel</Button>
          </ModalFooter>
        </Modal>
      )
    }.bind(this));

    return (
      <div name="login-container">
        <TopBar selected={1} navBarOn={true} history={this.props.history}/>
        <Container>
            {couponModals}
            <h1>My Coupons</h1>
            <Row>
              <Col xs={12} sm={12}>
                <FormGroup>
                  <InputGroup>
                    <InputGroupAddon><Icon icon={ic_search}/></InputGroupAddon>
                    <Input placeholder="Search" />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col xs={0} sm={1} hidden>
                <Button outline color="primary">Filter</Button>
              </Col>
              <Col xs={2} sm={1} hidden>
                <Button outline color="primary">Sort</Button>
              </Col>
            </Row>
          {couponComponents}
        </Container>
      </div>
    )
  }
}

module.exports = Home;
