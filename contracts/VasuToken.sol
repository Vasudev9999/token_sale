pragma solidity ^0.4.2;

pragma solidity ^0.4.2;

contract VasuToken {
    uint256 public totalSupply;

    function VasuToken() public {  // ✅ OLD SYNTAX FOR SOLIDITY 0.4.2
        totalSupply = 1000000;
    }
}


// contract VasuToken {
//     // Constructor
//     // Set the total number of tokens
//     // Read the total number of tokens
//     uint256 public totalSupply;

//     function VasuToken () public {
//         totalSupply = 1000000;
//     }
// }
