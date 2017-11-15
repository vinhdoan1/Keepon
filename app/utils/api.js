/*
Represents simulated backend with api calls that modify local storage.
*/

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
      used,
    }
    shoppinglist: []
  },
  discoverableCoupons: [
  {
    savings,
    store,
    date,
    category,
    location,
    used,
    zip,
    discoverLocation,
  }]
}
*/

function saveUser(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function saveUserData(userdata) {
  localStorage.setItem('alluserdata', JSON.stringify(userdata));
}

function saveDiscoverCoupons(discoverCoupons) {
  localStorage.setItem('discovercoupons', JSON.stringify(discoverCoupons));
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

function getDiscoverCoupons() {
  var discoverCouponString = localStorage.getItem("discovercoupons");
  var discoverCouponData = [];
  if (discoverCouponString != null) {
    discoverCouponData = JSON.parse(discoverCouponString);
  } else {
    saveDiscoverCoupons(discoverCouponData);
  }
  return discoverCouponData;
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

function addCoupon(userID, cSavings, cStore, cDate, cCategory, cLocation, cDiscoverable, cZip, cDiscoverLocation, cDateAdded) {
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
    discoverable: cDiscoverable,
    zip: cZip,
    discoverLocation: cDiscoverLocation,
    dateAdded: cDateAdded,
  };
  allUserData[userID] = userData;
  saveUserData(allUserData);
}

function addCouponToDiscoverable(cSavings, cStore, cDate, cCategory, cLocation, cZip, cDiscoverLocation, cDateAdded) {
  var allDiscoverCoupons = getDiscoverCoupons();
  allDiscoverCoupons.push({
    savings: cSavings,
    store: cStore,
    date: cDate,
    category: cCategory,
    location: cLocation,
    zip: cZip,
    discoverLocation: cDiscoverLocation,
    dateAdded: cDateAdded,
  });
  saveDiscoverCoupons(allDiscoverCoupons);
}

function editCoupon(userID, couponID, cSavings, cStore, cDate, cCategory, cLocation, cDiscoverable, cZip, cDiscoverLocation) {
  var allUserData = getUserData();
  var userData = allUserData[userID];
  userData.coupons[couponID] = {
    savings: cSavings,
    store: cStore,
    date: cDate,
    category: cCategory,
    location: cLocation,
    discoverable: cDiscoverable,
    zip: cZip,
    discoverLocation: cDiscoverLocation,
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
  return markedCoupons;
}

function getUsedCoupons(userID) {
  var allUserData = getUserData();
  var userData = allUserData[userID];
  var usedCoupons = userData.coupons.filter(function(coupon) {
    return coupon.used;
  });
  return usedCoupons;
}

function deleteCoupon(userID, couponID) {
  var allUserData = getUserData();
  var userData = allUserData[userID];
  delete userData.coupons[couponID];
  allUserData[userID] = userData;
  saveUserData(allUserData);
}

function deleteAllUsedCoupons(userID) {
  var allUserData = getUserData();
  var userData = allUserData[userID];
  userData.coupons = userData.coupons.filter(function(coupon) {
    return !coupon.used;
  });
  allUserData[userID] = userData;
  saveUserData(allUserData);
}

module.exports = {
  login: getUserIDFromCredentials,
  addUser: addUser,
  addCoupon: addCoupon,
  editCoupon: editCoupon,
  markCoupon: markCoupon,
  addCouponToShoppingList: addCouponToShoppingList,
  getDiscoverCoupons: getDiscoverCoupons,
  getCoupons: getCoupons,
  getMarkedCoupons: getMarkedCoupons,
};
