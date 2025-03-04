pragma solidity ^0.4.2;

contract Migrations {
    address public owner;
    uint public lastCompletedMigration;

    modifier restricted() {
        if (msg.sender != owner) {
            throw; // Instead of require
        }
        _;
    }

    function Migrations() public {
        owner = msg.sender;
    }

    function setCompleted(uint completed) public restricted {
        lastCompletedMigration = completed;
    }

    function upgrade(address newAddress) public restricted {
        Migrations upgraded = Migrations(newAddress);
        upgraded.setCompleted(lastCompletedMigration);
    }
}

// pragma solidity ^0.4.2;

// contract Migrations {
//     address public owner;
//     uint public lastCompletedMigration;

//     modifier restricted() {
//         require(msg.sender == owner);
//         _;
//     }

//     function Migrations() public {
//         owner = msg.sender;
//     }

//     function setCompleted(uint completed) public restricted {
//         lastCompletedMigration = completed;
//     }

//     function upgrade(address newAddress) public restricted {
//         Migrations upgraded = Migrations(newAddress);
//         upgraded.setCompleted(lastCompletedMigration);
//     }
// }
