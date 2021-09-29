// Ref : https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#deploy

import { useEffect, useState } from 'react';
import Web3 from 'web3';
import SimpleToken from './build/contracts/SimpleToken.json';

let web3;
let regex = RegExp('^[0-9]+$');
let accounts;

function App() {

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [decimals, setDecimals] = useState('');
  const [supply, setSupply] = useState('');
  const [error, setError] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [txHash, setTxHash] = useState('');
  
  useEffect(() => {
      
      async function init() {
      if(window.ethereum) {
        await window.ethereum.request({ method : 'eth_requestAccounts'});
        accounts = await window.ethereum.request({ method : 'eth_accounts'});
        console.log(accounts);  
        web3 = new Web3(window.ethereum);

      } else {
        console.log('Install MetaMask');
      }
    }
    init();
  }, []);

  async function handleSubmit(e) {
    console.log('Handlesubmit');
    e.preventDefault();
    let contract;
    let tx;

    try {
      contract = new web3.eth.Contract(SimpleToken.abi);
      tx = await contract.deploy({
        data : SimpleToken.bytecode, 
        arguments : [name, symbol, decimals, supply]
      })
      .send({from : accounts[0]}, (error, txHash) => {
          if(error) {
            setError(error.message);
          } else {
            setTxHash(txHash);
          }
      });
      setError('');
      setContractAddress(tx.options.address);
    } catch(error) {
      setError(error.message);
    }
  }

  async function decimalChange(e) {

    if(regex.test(e.target.value)) {
      setDecimals(e.target.value);
      setError('');
    } else {
      setError('Enter numbers');
    }
  }

  async function supplyChange(e) {
    if(regex.test(e.target.value)) {
      setSupply(e.target.value);
      setError('');
    } else {
      setError('Enter numbers');
    }
  }

  return (
    <div className="App" onSubmit={handleSubmit}>
      <h1>ERC20 Token Creator</h1>
      <form className="create-form">
        <input id="name" type="text" placeholder="Name" onChange={e => setName(e.target.value)}/>
        <input id="name" type="text" placeholder="Symbol" onChange={e => setSymbol(e.target.value)}/>
        <input id="name" type="text" placeholder="Decimals" onChange={e => decimalChange(e)}/>
        <input id="name" type="text" placeholder="Total Supply" onChange={e => supplyChange(e)}/>
        <button type="submit">Create</button>
      </form>
      <div style={{display : error ? 'block' : 'none'}}>ERROR : {error}</div>
      <div className="tx-hash" style={{display : contractAddress ? 'block' : 'none'}}>Contract Address : {contractAddress}</div>
      <div className="contract-address" style={{display : txHash ? 'block' : 'none'}}>Transaction Address : {txHash}</div>
    </div>
  );
}

export default App;