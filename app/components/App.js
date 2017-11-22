var React = require('react');
var Login = require('./Login');
var Home = require('./Home');
var ShoppingList = require('./ShoppingList');
var AddCoupon = require('./AddCoupon');
var AddCoupon2 = require('./AddCoupon2');
var Discover = require('./Discover');
var NewUser = require('./NewUser');
var HistoryPage = require('./History');
var ReactRouter = require('react-router-dom');
var BrowserRouter = ReactRouter.BrowserRouter;
var Route = ReactRouter.Route;

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-110103238-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-110103238-1');
</script>

class App extends React.Component {
  render () {
    return (
      <BrowserRouter>
        <div className='app-container'>
          <Route exact path='/' component={Login} />
          <Route path='/home' component={Home} />
          <Route path='/shoppinglist' component={ShoppingList} />
          <Route path='/addcoupon' component={AddCoupon} />
          <Route path='/addcoupon2' component={AddCoupon2} />
          <Route path='/discover' component={Discover} />
          <Route path='/newuser' component={NewUser} />
          <Route path='/history' component={HistoryPage} />
        </div>
      </BrowserRouter>
    )
  }
}

module.exports = App;
