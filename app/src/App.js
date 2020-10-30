import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Button, Col, Form, Container, Row } from "react-bootstrap";
import './App.css';
import logo from './logo.svg';
import Token from "./contracts/Token.json";
import TokenSolMinter from "./contracts/TokenSolMinter.json";

function App() {
  const [account, setAccount] = useState('');
  const [tokenSolMinter, setTokenSolMinter] = useState(null);
  const [tokenSol, setTokenSol] = useState(null);  
  const [name, setName] = useState('');

  const [inputMintValue, setInputMintValue] = useState();
  const [inputMintAddress, setInputMintAddress] = useState();  
 

  useEffect(() => {
    async function loadWeb3() {      
      //window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545/'));
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert(
          'Non-Ethereum browser detected. You should consider trying MetaMask!',
        );
      }
      console.log (window.web3.currentProvider);
    }
    
    async function loadBlockchainData() {
      try {
        const web3 = window.web3;
       
        // Load first account
        const [account] = await web3.eth.getAccounts();
        console.log ('account: ', account);
        setAccount(account);

        // Check which network is active on web3
        const networkId = await web3.eth.net.getId();
        console.log ('networkId: ', networkId);

        // Check if ElFederal has been published on that network
        var networkData = TokenSolMinter.networks[networkId];        
        if (networkData) {
          console.log ('TokenSolMinter address: ', networkData.address);
          var contract = new web3.eth.Contract(
            TokenSolMinter.abi,
            networkData.address,
          );
          setTokenSolMinter(contract);

          var tokenAddress = await contract.methods.tokenSol().call();
          console.log ('tokenSol address: ', tokenAddress);
          if (networkData) {
            contract = new web3.eth.Contract(
              Token.abi,
              tokenAddress,
            );
            setTokenSol(contract);
            setName(await contract.methods.name().call());
          }
        } else {
          window.alert('Smart contract not deployed to detected network.');
        }
      } catch (error) {
        console.error(error);
      }
    }
    loadWeb3().then(() => loadBlockchainData());
  }, []);

  const handleMint = e => {
    e.preventDefault();

    console.log ('inputMintAddress: ', inputMintAddress);
    console.log ('inputMintValue: ', inputMintValue);
    tokenSolMinter.methods.mint(inputMintAddress.toLowerCase(), inputMintValue)
      .send({ from: account })
      .once('receipt', receipt => {
        console.log ('transaction receipt: ', receipt);
        setInputMintAddress('');
        setInputMintValue();
      });
  };
   
  
  return (
    <Container>
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />

        <div>
          <h1>Token Minter</h1>
          {tokenSol && <p>Token {name}: {tokenSol._address}</p>}
          {account && <p>Your account: {account}</p>}
        </div>

        <Row>
          <Col>
            <Form onSubmit={handleMint}>
              <Form.Group controlId="formMintAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  placeholder="Address"
                  onChange={(e) => setInputMintAddress(e.target.value)}
                  value={inputMintAddress}
                />
              </Form.Group>
              <Form.Group controlId="formMintValue">
                <Form.Label>Value</Form.Label>
                <Form.Control
                  placeholder="Value"
                  onChange={(e) => setInputMintValue(e.target.value)}
                  value={inputMintValue}
                />
              </Form.Group>
              <Button type="submit">Mint</Button>
            </Form>          
          </Col>
        </Row>
      </div>
      
      <br/>
      <br/>
      Imagem: <a href="https://commons.wikimedia.org/wiki/File:Emojione_1F31E.svg">Emoji One</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA 4.0</a>, via Wikimedia Commons
    </Container>

  );
}

export default App;
