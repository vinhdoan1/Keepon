/*
data structure:
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

// generates unique ID
function generateID() {
  return Date.now().toString(36);
}

function getUsers() {
  var allUsersString = localStorage.getItem("users");
  var allUsers = [];
  if (allUsersString != null) {
    allUsers = JSON.parse(allUsersString);
  } else {
    saveUser(allUsers);
  }
  return allUsers;
}

function getUserData() {
  var allUserDataString = localStorage.getItem("alluserdata");
  var allUserData = {};
  if (allUserDataString != null) {
    allUserData = JSON.parse(allUserDataString);
  } else {
    saveUserData(allUserData);
  }
  return allUserData;
}

function getUserIDFromCredentials(name, pass) {
  var allUsers = getUsers();
  for (var i = 0; i < allUsers.length; i++) {
    var user = allUsers[i];
    if (user.name === name && user.pass === pass) {
      return user.id;
    }
  }
  return null;
}

function addUser(username, password) {
  var alllUsers = getUsers();
  var allUserData = getUserData();

  var newID = generateID();
  alllUsers.push({
    name: username,
    pass: password,
    id: newID,
  })
  allUserData[newID] = {
    id: newID,
    coupons: {},
    shoppingList: [],
  }

  saveUser(alllUsers);
  saveUserData(allUserData);

  return newID;
}

function addCoupon(userID, cSavings, cStore, cDate, cCategory, cLocation) {
  var allUserData = getUserData();
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

function markCoupon(userID, couponID, mark) {
  var allUserData = getUserData();
  var userData = allUserData[userID];
  userData.coupons[couponID].used = mark;
  allUserData[userID] = userData;
  saveUserData(allUserData);
}

function addCouponToShoppingList(userID, couponID) {
  var allUserData = getUserData();
  var userData = allUserData[userID];
  userData.shoppingList.push(couponID);
  allUserData[userID] = userData;
  saveUserData(allUserData);
}

function getCoupons(userID) {
  var allUserData = getUserData();
  return allUserData[userID].coupons;
}

function getMarkedCoupons(userID) {
  var allUserData = getUserData();
  var userData = allUserData[userID];
  var coupons = userData.coupons;
  var markedCoupons = {};
  for (var i = 0; i < userData.shoppingList.length; i++) {
    var userID = userData.shoppingList[i];
    markedCoupons[userID] = coupons[userID];
  }
  console.log(markedCoupons);
  return markedCoupons;
}

module.exports = {
  login: getUserIDFromCredentials,
  addUser: addUser,
  addCoupon: addCoupon,
  markCoupon: markCoupon,
  addCouponToShoppingList: addCouponToShoppingList,
  getCoupons: getCoupons,
  getMarkedCoupons: getMarkedCoupons,
};
