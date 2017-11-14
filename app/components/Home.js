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

    // filter that removes used coupons
    filters.push(function(coupon) {
      var searchTerm = this.state.searchTerm;
      if (searchTerm == "")
        return true;
      return coupon.savings.includes(searchTerm) || coupon.store.includes(searchTerm);
    }.bind(this));

    return (
      <div name="login-container">
        <TopBar selected={1} navBarOn={true} history={this.props.history}/>
        <Container>
            <h1>My Coupons</h1>
            <Row>
              <Col xs={12} sm={12}>
                <FormGroup onChange={this.onSearchChange}>
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
