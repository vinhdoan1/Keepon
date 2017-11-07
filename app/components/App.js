var React = require('react');
var Login = require('./Login');
var Home = require('./Home');
var ShoppingList = require('./ShoppingList');
var AddCoupon = require('./AddCoupon');
var Discover = require('./discover');
var ReactRouter = require('react-router-dom');
var BrowserRouter = ReactRouter.BrowserRouter;
var Route = ReactRouter.Route;

class App extends React.Component {
  render () {
    return (
      <BrowserRouter>
        <div className='app-container'>
          <Route exact path='/' component={Login} />
          <Route path='/home' component={Home} />
          <Route path='/shoppinglist' component={ShoppingList} />
          <Route path='/addcoupon' component={AddCoupon} />
          <Route path='/discover' component={Discover} />
        </div>
      </BrowserRouter>
    )
  }
}

module.exports = App;
