import web3 from "./web3";
import CampaignFactory from './build/CampaignFactory.json';

const factoryContract = new web3.eth.Contract(CampaignFactory.abi, '0xA3Be3c4a47b135E54872F574D671B20e41eb1dF5');

export default factoryContract;