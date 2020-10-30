const Token = artifacts.require("./Token.sol");

const name = 'My RSK token';
const symbol = 'MRT';
const decimals = 2;
const amount = 100 * 10 ** decimals;

contract("Token", accounts => {

  let token;

  beforeEach('test', async () => {
    token = await Token.new();
  });
  
  describe('Constructor', () => {

    it("has symbol", async () => {
      const response = await token.symbol();
      assert.equal(response, symbol, 'wrong symbol');
    });

    it("has initial supply equal zero", async () => {
      const response = await token.totalSupply();
      assert.equal(response, 0, 'initial supply must be zero');
    });
  });

  describe('Mint', () => {

    it('check totalSupply after mint', async () => {
      var totalSupplyBefore = await token.totalSupply();
      await token.mint(accounts[1], amount, { from: accounts[0] });
      var totalSupplyAfter = await token.totalSupply();      
      assert.equal(Number(totalSupplyBefore + amount), Number(totalSupplyAfter));
    });
  });

  describe('Transfer', () => {
    it('check balance after transfer', async () => {
      await token.mint(accounts[1], amount, { from: accounts[0] });
      var balance2before = await token.balanceOf(accounts[2]);
      await token.transfer(accounts[2], amount, { from: accounts[1] })
      var balance2after = await token.balanceOf(accounts[2]);
      assert.equal(Number(balance2before + amount), Number(balance2after));
    });
  });

});