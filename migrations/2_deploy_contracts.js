const Token = artifacts.require("Token");
const TokenMinter = artifacts.require("TokenSolMinter");

module.exports = async (deployer, network, accounts)=> {

  tokenSol = await deployer.deploy(Token, {from: accounts[0]});
  console.log("tokenSol", tokenSol);

  //tokenSolMinter = await deployer.deploy(TokenMinter, tokenSol.address, {from: accounts[0]});
  //console.log("tokenSolMinter.address", tokenSolMinter.address);

};
