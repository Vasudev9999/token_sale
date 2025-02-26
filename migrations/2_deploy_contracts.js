var VasuToken = artifacts.require("./VasuToken.sol");

module.exports = function(deployer) {
  deployer.deploy(VasuToken);
};
