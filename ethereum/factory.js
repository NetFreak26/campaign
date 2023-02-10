import web3 from "./web3";
import CampaignFactory from './build/CampaignFactory.json';

const factoryContract = new web3.eth.Contract(CampaignFactory.abi, '0xEefB881448187BAe86137a0352c6d1eD0D7b392b');

export default factoryContract;