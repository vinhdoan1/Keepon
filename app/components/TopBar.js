var React = require('react');
var PropTypes = require('prop-types');
import { Nav, NavItem, NavLink} from 'reactstrap';
import { logout } from "../actions/";
import { connect } from "react-redux";

@connect((store) => {
  return {
  }
})
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(e) {
    this.props.dispatch(logout());
    this.props.history.push({
      pathname: '/',
    });
  }

  render() {
    var keeponLogoImg = require('../images/keepon_logo.png');

    var navItemNames =
    [
      ['Add Coupon', 'addcoupon'],
      ['My Coupons', 'home'],
      ['Shopping List', 'shoppinglist'],
      ['Discover', 'discover']
    ];
    //var navItemNames = ['Add Coupon', 'My Coupons', 'Shopping List'];

    var navItems = navItemNames.map(function(navItemName, i) {
      return (
          <NavItem key={i}>
              <NavLink href={navItemName[1]} active={(i==this.props.selected)}>{navItemName[0]}</NavLink>
          </NavItem>)
    }.bind(this));

    return (
      <div className = 'top-bar-container'>
        <div className = 'top-bar-top'>
          <img src={keeponLogoImg}/>
          <h1 onClick={this.handleLogout}>Logout</h1>
        </div>
        <div className = 'top-bar-nav'>
          {this.props.navBarOn &&
            <Nav pills justified onSelect={this.handleSubmit}>
                {navItems}
            </Nav>
          }
        </div>
      </div>
    )
  }
}

TopBar.propTypes = {
  selected: PropTypes.number.isRequired,
  navBarOn: PropTypes.bool.isRequired,
};

module.exports = TopBar;
