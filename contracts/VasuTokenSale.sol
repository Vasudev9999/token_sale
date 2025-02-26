pragma solidity ^0.4.2;

import "./VasuToken.sol";

contract VasuTokenSale {
    address public admin;
    VasuToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address indexed _buyer, uint256 _amount);

    function VasuTokenSale(VasuToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

function multiply(uint x, uint y) internal constant returns (uint z) {
        if (x == 0 || y == 0) return 0;
        z = x * y;
        if (z / x != y) throw;
        return z;
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        if (msg.value != multiply(_numberOfTokens, tokenPrice)) throw;
        if (tokenContract.balanceOf(this) < _numberOfTokens) throw;
        if (!tokenContract.transfer(msg.sender, _numberOfTokens)) throw;

        tokensSold += _numberOfTokens;
        Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
        if (msg.sender != admin) throw;

        uint256 contractBalance = tokenContract.balanceOf(this);
        if (contractBalance > 0) {
            if (!tokenContract.transfer(admin, contractBalance)) throw;
        }

        // Fire event before selfdestruct
        Sell(admin, contractBalance);

        // Secure selfdestruct by explicitly converting admin to payable address
        selfdestruct(address(uint160(admin)));
    }
}
