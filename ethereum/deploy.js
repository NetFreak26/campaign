const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const compiledCampaignFactory = require('./build/CampaignFactory.json');
const provider = new HDWalletProvider({
    mnemonic: 'liquid ordinary tortoise across total curious stock brother indicate pig message siren',
    providerOrUrl: 'https://goerli.infura.io/v3/bd7e3bb95e2c4d9bb8063bc16275ed90',
    addressIndex: 0
})

const web3 = new Web3(provider);

let factoryContract;

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    
    factoryContract = await new web3.eth.Contract(compiledCampaignFactory.abi)
                            .deploy({ data: compiledCampaignFactory.evm.bytecode.object})
                            .send({ from: accounts[0], gas: 10000000});

    provider.engine.stop();
}

deploy();

export default address = factoryContract.options.address;