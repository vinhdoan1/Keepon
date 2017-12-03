function getExperiment() {
  return true;
  var result = localStorage.getItem("addcoupontest");
  if (result == null) {
    //result = (Math.random() >= 0.5);
    localStorage.setItem('addcoupontest', result);
  }
  return result;
}

module.exports = {
  getExperiment: getExperiment,
};
