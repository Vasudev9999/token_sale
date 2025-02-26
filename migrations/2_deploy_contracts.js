var VasuToken = artifacts.require("./VasuToken.sol");

module.exports = function(deployer) {
  deployer.deploy(VasuToken, 1000000); // Deploy with an initial supply of 1,000,000 tokens
};
