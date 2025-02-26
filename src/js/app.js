App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  tokenPrice: 1000000000000000,
  tokensSold: 0,
  tokensAvailable: 750000,

  init: async function() {
    console.log("App initialized...");
    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.error("User denied account access");
      }
    } else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContracts();
  },

  initContracts: function() {
    $.getJSON("VasuTokenSale.json", function(VasuTokenSale) {
      App.contracts.VasuTokenSale = TruffleContract(VasuTokenSale);
      App.contracts.VasuTokenSale.setProvider(App.web3Provider);
      App.contracts.VasuTokenSale.deployed().then(function(instance) {
        console.log("Vasu Token Sale Address:", instance.address);
      });
    }).done(function() {
      $.getJSON("VasuToken.json", function(VasuToken) {
        App.contracts.VasuToken = TruffleContract(VasuToken);
        App.contracts.VasuToken.setProvider(App.web3Provider);
        App.contracts.VasuToken.deployed().then(function(instance) {
          console.log("Vasu Token Address:", instance.address);
        });

        App.listenForEvents();
        return App.render();
      });
    })
  },

  listenForEvents: function() {
    App.contracts.VasuTokenSale.deployed().then(function(instance) {
      instance.Sell({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function(error, event) {
        console.log("event triggered", event);
        App.render();
      });
    }).catch(function(err) {
      console.error("Error listening for events:", err);
    });
  },

  render: function() {
    if (App.loading) {
      return;
    }
    App.loading = true;

    var loader = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();

    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $('#accountAddress').html("Your Account: " + account);
      }
    });

    App.contracts.VasuTokenSale.deployed().then(function(instance) {
      VasuTokenSaleInstance = instance;
      return VasuTokenSaleInstance.tokenPrice();
    }).then(function(tokenPrice) {
      App.tokenPrice = tokenPrice;
      $('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());
      return VasuTokenSaleInstance.tokensSold();
    }).then(function(tokensSold) {
      App.tokensSold = tokensSold.toNumber();
      $('.tokens-sold').html(App.tokensSold);
      $('.tokens-available').html(App.tokensAvailable);

      var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
      $('#progress').css('width', progressPercent + '%');

      App.contracts.VasuToken.deployed().then(function(instance) {
        VasuTokenInstance = instance;
        return VasuTokenInstance.balanceOf(App.account);
      }).then(function(balance) {
        $('.Vasu-balance').html(balance.toNumber());
        App.loading = false;
        loader.hide();
        content.show();
      });
    }).catch(function(error) {
      console.error("Error in render:", error);
    });
  },

  buyTokens: function() {
    $('#content').hide();
    $('#loader').show();
    var numberOfTokens = $('#numberOfTokens').val();
    App.contracts.VasuTokenSale.deployed().then(function(instance) {
      return instance.buyTokens(numberOfTokens, {
        from: App.account,
        value: numberOfTokens * App.tokenPrice,
        gas: 500000 
      });
    }).then(function(result) {
      console.log("Tokens bought...");
      $('form').trigger('reset');
    }).catch(function(error) {
      console.error("Error buying tokens:", error);
    });
  }
}

$(function() {
  $(window).on("load", function() {
    App.init();
  });
});
