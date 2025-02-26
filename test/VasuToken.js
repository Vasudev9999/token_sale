var VasuToken = artifacts.require('./VasuToken.sol');

contract('VasuToken', function(accounts) {
  var tokenInstance;

  it('initializes the contract with the correct values', function() {
    return VasuToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.name();
    }).then(function(name) {
      assert.equal(name, 'Vasu Token', 'has the correct name');
      return tokenInstance.symbol();
    }).then(function(symbol) {
      assert.equal(symbol, 'VASU', 'has the correct symbol');
      return tokenInstance.standard();
    }).then(function(standard) {
      assert.equal(standard, 'Vasu Token v1.0', 'has the correct standard');
    });
  });

  it('allocates the initial supply upon deployment', function() {
    return VasuToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.totalSupply();
    }).then(function(totalSupply) {
      assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function(adminBalance) {
      assert.equal(adminBalance.toNumber(), 1000000, 'allocates the initial supply to admin');
    });
  });

  it('transfers token ownership', function() {
    return VasuToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.transfer.call(accounts[1], 99999999999999999999999);
    }).then(assert.fail).catch(function(error) {
      assert(error, 'Expected an error but did not get one');
      return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      return tokenInstance.balanceOf(accounts[1]);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 250000, 'adds amount to recipient');
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 750000, 'deducts amount from sender');
    });
  });

  it('approves tokens for delegated transfer', function() {
    return VasuToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.approve(accounts[1], 100);
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      return tokenInstance.allowance(accounts[0], accounts[1]);
    }).then(function(allowance) {
      assert.equal(allowance.toNumber(), 100, 'stores the allowance');
    });
  });

  it('handles delegated token transfers', function() {
    return VasuToken.deployed().then(function(instance) {
      tokenInstance = instance;
      fromAccount = accounts[2];
      toAccount = accounts[3];
      spendingAccount = accounts[4];
      return tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
    }).then(function(receipt) {
      return tokenInstance.approve(spendingAccount, 10, { from: fromAccount });
    }).then(function(receipt) {
      return tokenInstance.transferFrom(fromAccount, toAccount, 9999, { from: spendingAccount });
    }).then(assert.fail).catch(function(error) {
      assert(error, 'Expected an error but did not get one');
      return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
    }).then(function(success) {
      assert.equal(success, true);
    });
  });
});
