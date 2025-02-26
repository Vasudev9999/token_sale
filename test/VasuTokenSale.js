var VasuToken = artifacts.require('./VasuToken.sol');
var VasuTokenSale = artifacts.require('./VasuTokenSale.sol');

contract('VasuTokenSale', function(accounts) {
  var tokenInstance;
  var tokenSaleInstance;
  var admin = accounts[0];
  var buyer = accounts[1];
  var tokenPrice = 1000000000000000; // 0.001 Ether
  var tokensAvailable = 750000;
  var numberOfTokens;

  it('initializes the contract with the correct values', function() {
    return VasuTokenSale.deployed().then(function(instance) {
      tokenSaleInstance = instance;
      return tokenSaleInstance.address;
    }).then(function(address) {
      assert.notEqual(address, 0x0, 'has contract address');
      return tokenSaleInstance.tokenContract();
    }).then(function(address) {
      assert.notEqual(address, 0x0, 'has token contract address');
      return tokenSaleInstance.tokenPrice();
    }).then(function(price) {
      assert.equal(price.toNumber(), tokenPrice, 'token price is correct');
    });
  });

  it('facilitates token buying', function() {
    return VasuToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return VasuTokenSale.deployed();
    }).then(function(instance) {
      tokenSaleInstance = instance;
      return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin });
    }).then(function(receipt) {
      return tokenInstance.balanceOf(tokenSaleInstance.address);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), tokensAvailable, 'Token Sale has received tokens');
      numberOfTokens = 10;
      return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
      assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the buyer');
      assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
      return tokenSaleInstance.tokensSold();
    }).then(function(amount) {
      assert.equal(amount.toNumber(), numberOfTokens, 'increments tokens sold');
      return tokenInstance.balanceOf(buyer);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), numberOfTokens, 'adds purchased tokens to buyer');
    });
  });

  it('ends token sale', function() {
    return VasuToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return VasuTokenSale.deployed();
    }).then(function(instance) {
      tokenSaleInstance = instance;
      return tokenSaleInstance.endSale({ from: buyer });
    }).then(assert.fail).catch(function(error) {
      assert(
        error.message.includes('revert') || 
        error.message.includes('invalid opcode') || 
        error.message.includes('VM Exception'),
        'must be admin to end sale'
      );
      return tokenSaleInstance.endSale({ from: admin });
    }).then(function(receipt) {
      return tokenInstance.balanceOf(admin);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 999990, 'returns all unsold Vasu tokens to admin');
    });
  });
});
