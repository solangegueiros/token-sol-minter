pragma solidity 0.5.2;
import '@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol';
contract Token is ERC20Mintable{
       string public name = "Sol";
       string public symbol = "SOL";
       uint8 public decimals = 2;
}
