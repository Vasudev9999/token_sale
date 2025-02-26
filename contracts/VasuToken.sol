pragma solidity ^0.4.2;

contract VasuToken {
    string public name = "Vasu Token";
    string public symbol = "VASU";
    string public standard = "Vasu Token v1.0";
    uint256 public totalSupply;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    mapping(address => uint256) public balanceOf;

    function VasuToken(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        if (balanceOf[msg.sender] < _value) {
            throw; // Instead of require
        }

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        Transfer(msg.sender, _to, _value); // Solidity <0.4.21 doesn't use 'emit'
        return true;
    }
}

// pragma solidity ^0.4.2;

// contract VasuToken {
//     string public name = "Vasu Token";
//     string public symbol = "VASU";
//     string public standard = "Vasu Token v1.0";
//     uint256 public totalSupply;

//     event Transfer(
//         address indexed _from,
//         address indexed _to,
//         uint256 _value
//     );

//     mapping(address => uint256) public balanceOf;

//     function VasuToken(uint256 _initialSupply) public {
//         balanceOf[msg.sender] = _initialSupply;
//         totalSupply = _initialSupply;
//     }

//     function transfer(address _to, uint256 _value) public returns (bool success) {
//         require(balanceOf[msg.sender] >= _value);

//         balanceOf[msg.sender] -= _value;
//         balanceOf[_to] += _value;

//         Transfer(msg.sender, _to, _value);
//         return true;
//     }
// }
