var VasuToken = artifacts.require("./VasuToken.sol");
var VasuTokenSale = artifacts.require("./VasuTokenSale.sol");

module.exports = function(deployer) {
  deployer.deploy(VasuToken, 1000000).then(function() {
    var tokenPrice = 1000000000000000; // 0.001 Ether
    return deployer.deploy(VasuTokenSale, VasuToken.address, tokenPrice);
  });
};
