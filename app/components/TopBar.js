var React = require('react');
var PropTypes = require('prop-types');
var ab = require('../utils/ab');
import { Nav, NavItem, NavLink} from 'reactstrap';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { logout } from "../actions/";
import { editcoupondone } from "../actions/";
import { connect } from "react-redux";
import ReactGA from 'react-ga';
ReactGA.initialize('UA-110103238-1');
ReactGA.pageview(window.location.pathname + window.location.search);

@connect((store) => {
  return {
  }
})
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountModal: false,
    };

    this.handleAccountButton = this.handleAccountButton.bind(this);
    this.toggleAccountModal = this.toggleAccountModal.bind(this);
  }

  handleAccountButton(e) {
    this.setState({
      accountModal: !this.state.accountModal,
    })

  }

  handleLinkButton(link) {
    this.props.dispatch(editcoupondone());
    if (link === 'addcoupon') {
      if (ab.getExperiment()) {
        link += '2';
      }
    }
    this.props.history.push({
      pathname: '/' + link,
    });
  }

  toggleAccountModal() {
    this.setState({
      accountModal: !this.state.accountModal,
    })
  }

  render() {
    var keeponLogoImg = require('../images/keepon_logo.png');
    var accountIcon = require('../images/account_icon.png');

    var navItemNames =
    [
      ['Add Coupon', 'addcoupon'],
      ['My Coupons', 'home'],
    //  ['Shopping List', 'shoppinglist'],
      ['Discover', 'discover'],
    ];
    //var navItemNames = ['Add Coupon', 'My Coupons', 'Shopping List'];

    var navItems = navItemNames.map(function(navItemName, i) {
      return (
          <NavItem key={i}>
              <NavLink onClick={() => {this.handleLinkButton(navItemName[1])}} active={(i==this.props.selected)}>{navItemName[0]}</NavLink>
          </NavItem>)
    }.bind(this));

    var accountOptions =
    [
      ['Coupon History', 'history'],
      ['Logout', ''],
    ];
    var accountListGroup = accountOptions.map(function(accountOption, i) {
      return <ListGroupItem key={i} tag="button" onClick={() => {
          if (accountOption[0] == 'Logout') {
            this.props.dispatch(logout());
          }
          this.props.history.push({
            pathname: '/' + accountOption[1],
          });
        }} action>{accountOption[0]}</ListGroupItem>
    }.bind(this));

    return (
      <div className = 'top-bar-container'>
        <div className = 'top-bar-top'>
          <a href='/home'>
            <img src={keeponLogoImg} />
          </a>
          <div className="btn btn-secondary" onClick={this.handleAccountButton}>
            Account
              <img src={accountIcon}/>
          </div>
        </div>
        <div className = 'top-bar-nav'>
          {this.props.navBarOn &&
            <Nav pills justified onSelect={this.handleSubmit}>
                {navItems}
            </Nav>
          }
        </div>
        <Modal isOpen={this.state.accountModal} toggle={this.toggleAccountModal}>
            <ModalHeader toggle={this.toggleAccountModal}>Account:</ModalHeader>
            <ModalBody>
              <ListGroup>
                {accountListGroup}
              </ListGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggleAccountModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
      </div>
    )
  }
}

TopBar.propTypes = {
  selected: PropTypes.number.isRequired,
  navBarOn: PropTypes.bool.isRequired,
};

module.exports = TopBar;
