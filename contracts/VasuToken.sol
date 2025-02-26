pragma solidity ^0.4.2;

contract VasuToken {
    string public name = "Vasu Token";
    string public symbol = "VASU";
    string public standard = "Vasu Token v1.0";
    uint256 public totalSupply;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function VasuToken(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        if (balanceOf[msg.sender] < _value) {
            throw; // Solidity 0.4.2 style
        }

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        Transfer(msg.sender, _to, _value); // No 'emit' in Solidity 0.4.2
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value); // Event without 'emit'
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        if (balanceOf[_from] < _value) {
            throw;
        }
        if (allowance[_from][msg.sender] < _value) {
            throw;
        }

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;

        Transfer(_from, _to, _value);
        return true;
    }
}
