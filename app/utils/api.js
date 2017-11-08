/*
{
  users: [{
    name: username,
    pass: password,
    id: newID,
  }],
  userData: {
    id,
    coupons: []
    {
      id
      savings,
      store,
      date,
      category,
      location,
      used
    }
    shoppinglist: []
  },
}
*/

function saveUser(users) {

  localStorage.setItem('users', JSON.stringify(users));
}

function saveUserData(userdata) {
  localStorage.setItem('alluserdata', JSON.stringify(userdata));
}



function getUserIDFromCredentials(name, pass) {

}

function addUser(username, password) {
  alllUsers = JSON.parse(localStorage.getItem("users"));
  allUserData = JSON.parse(localStorage.getItem("alluserdata"));

  var newID = generateID();
  alllUsers.push({
    name: username,
    pass: password,
    id: newID,
  })
  allUserData[id] = {
    id: newID,
    coupons: {},
    shoppingList: [],
  }

  saveUser(alllUsers);
  saveUserData(allUserData);
}

function addCoupon(userID, cSavings, cStore, cDate, cDategory, cLocation) {
  allUserData = JSON.parse(localStorage.getItem("alluserdata"));
  var userData = allUserData[userID];
  var id = generateID();
  userData.coupons[id] = {
    savings: cSavings,
    store: cStore,
    date: cDate,
    category: cCategory,
    location: cLocation,
    used: false,
  };
  allUserData[userID] = userData;
  saveUserData(allUserData);
}

function markCouponAsUsed(userID, couponID) {
  allUserData = JSON.parse(localStorage.getItem("alluserdata"));
  var userData = allUserData[userID];
  userData.coupons[couponID].used = true;
  saveUserData(allUserData);
}

function addCouponToShoppingList(userID, couponID) {
  allUserData = JSON.parse(localStorage.getItem("alluserdata"));
  var userData = allUserData[userID];
  userData.shoppinglist.push(couponID);
  saveUserData(userData);
}

// generates unique ID
function generateID() {
  return Date.now().toString(36);
}
