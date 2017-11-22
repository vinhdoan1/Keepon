var React = require('react');
var TopBar = require('./TopBar');
var CouponData = require('./CouponData');
import { Container, Row, Col } from 'reactstrap';
var api = require('../utils/api');

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-110103238-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-110103238-1');
</script>

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    var filters = [];

    // filter that shows used coupons
    filters.push(function(coupon) {
      return coupon.used;
    });

    var buttons = [];

    var deleteCouponFunc = function(userID, couponID) {
      api.deleteCoupon(userID, couponID);
    }
    buttons.push({
      buttonText: "Delete Coupon",
      buttonFunc: deleteCouponFunc,
      buttonColor: "danger",
    })

    var markCouponUnusedFunc = function(userID, couponID) {
      api.markCoupon(userID, couponID, false);
    }
    buttons.push({
      buttonText: "Mark as unused",
      buttonColor: "primary",
      buttonFunc: markCouponUnusedFunc,
    });

    return (
      <div name="history-container">
        <TopBar selected={-1} navBarOn={true} history={this.props.history}/>
        <Container>
          <h1>History</h1>
          <CouponData
            cols={2}
            filters={filters}
            buttons={buttons}
            />
        </Container>
      </div>
    )
  }
}

module.exports = History;
