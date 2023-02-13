import web3 from "./web3";
import CampaignFactory from './build/CampaignFactory.json';

const factoryContract = new web3.eth.Contract(CampaignFactory.abi, '0x81D4c2c461F3CEB8c32Cd097025680d53497F715');

export default factoryContract;