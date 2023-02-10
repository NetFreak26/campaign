import Web3 from 'web3';
//old code
//const web3 = new Web3(window.web3.currentProvider);
let web3;
 
//check for meta mask or use server side web3 call
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // We are in the browser and metamask is running.
  web3 = new Web3(window.web3.currentProvider);
} else {
  // We are on the server *OR* the user is not running metamask.
  const provider = new Web3.providers.HttpProvider(
    "https://goerli.infura.io/v3/bd7e3bb95e2c4d9bb8063bc16275ed90"
  );
  web3 = new Web3(provider);
}
 
export default web3;
