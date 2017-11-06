var React = require('react');
var TopBar = require('./TopBar');
import { Container, Row, Col } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

class AddCoupon extends React.Component {

  render() {

    return (
      <div name="add-coupon-container">
        <TopBar selected={0} navBarOn={true} history={this.props.history}/>
        <Container>
          <h1>Add Coupon</h1>
          <Form>
            <FormGroup>
              <Label for="savingsForm">Savings</Label>
              <Input name="savings" id="savingsForm" placeholder="Describe your deal" />
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
                <Input type="select" name="category" id="categoryForm">
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
              <Label for="locationForm">Where is the coupon stored?</Label>
              <Input name="location" id="locationForm" placeholder="ex: Wallet, Coupon Drawer, Pocket"/>
            </FormGroup>
            <Button>Cancel</Button>
            <Button>Submit</Button>
          </Form>
        </Container>
      </div>
    )
  }
}

module.exports = AddCoupon;
