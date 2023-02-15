import web3 from "./web3";
import CampaignFactory from './build/CampaignFactory.json';

const factoryContract = new web3.eth.Contract(CampaignFactory.abi, '0x1E02C5c59A2B97A14f9bFB4eB132F9d28736fF31');

export default factoryContract;