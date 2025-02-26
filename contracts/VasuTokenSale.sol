pragma solidity ^0.4.2;

import "./VasuToken.sol";

contract VasuTokenSale {
    address public admin;
    VasuToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address indexed _buyer, uint256 _amount);

    constructor(VasuToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function tokensAvailable() public view returns (uint256) {
        return tokenContract.balanceOf(this);
    }

    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(x == 0 || y == 0 || (z = x * y) / x == y);
        return z;
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value == multiply(_numberOfTokens, tokenPrice));
        require(tokenContract.balanceOf(this) >= _numberOfTokens);
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        tokensSold += _numberOfTokens;
        Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
        require(msg.sender == admin);

        uint256 contractBalance = tokenContract.balanceOf(this);
        if (contractBalance > 0) {
            require(tokenContract.transfer(admin, contractBalance));
        }

        // Fire event before selfdestruct
        Sell(admin, contractBalance);

        // Secure selfdestruct by explicitly converting admin to payable address
        selfdestruct(address(uint160(admin)));
    }
}
