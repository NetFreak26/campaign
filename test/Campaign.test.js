const assert = require('assert');
const ganache = require('ganache');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const compiledCampaignFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let campaignFactory;
let campaign;
let campaignAddress;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    campaignFactory = await new web3.eth.Contract(compiledCampaignFactory.abi)
                        .deploy({data: compiledCampaignFactory.evm.bytecode.object})        
                        .send({from: accounts[0], gas: 10000000});

    await campaignFactory.methods.createCampaign("Education", "Want to teach children", 1000, 10000, 6).send({
        from: accounts[1],
        gas: 10000000
    });

    campaignAddress = await campaignFactory.methods.campaigns(0).call();

    campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
})

describe('tests Campaign', () => {

    it('deploys the campaignFactory and campaign', () => {

        assert.ok(campaignFactory.options.address);
        assert.ok(campaign.options.address);
    })

    it('sets the campaign initial values correct', async () => {

        assert.equal(await campaign.methods.manager().call(), accounts[1]);
        assert.equal(await campaign.methods.minimumContribution().call(), 1000);
        assert.equal(await campaign.methods.target().call(), 10000);
    })

    it('requires the minimum contribution', async () => {
        let minContributionFlag = false;
        try {
            await campaign.methods.contribute().send({
                from: accounts[2],
                value: 999,
                gas: 1000000
            });;
        } catch(err) {
            minContributionFlag = true;
        }
        assert(minContributionFlag, true);
    })

    it('contribute works fine and does not add same contributor again', async () => {
        await campaign.methods.contribute().send({
            from: accounts[2],
            value: 1000,
            gas: 1000000
        });
        assert.equal(await campaign.methods.noOfContributors().call(), 1);
        assert.equal(await campaign.methods.totalContribution().call(), 1000);
        assert.equal(await campaign.methods.contributors(accounts[2]).call(), 1000);

        await campaign.methods.contribute().send({
            from: accounts[2],
            value: 1000,
            gas: 1000000
        });
        assert.equal(await campaign.methods.noOfContributors().call(), 1);
        assert.equal(await campaign.methods.totalContribution().call(), 2000);
        assert.equal(await campaign.methods.contributors(accounts[2]).call(), 2000);

        await campaign.methods.contribute().send({
            from: accounts[3],
            value: 1000,
            gas: 1000000
        });
        assert.equal(await campaign.methods.noOfContributors().call(), 2);
        assert.equal(await campaign.methods.totalContribution().call(), 3000);
        assert.equal(await campaign.methods.contributors(accounts[2]).call(), 2000);
        assert.equal(await campaign.methods.contributors(accounts[3]).call(), 1000);
    })

    it('only manager can create a request', async () => {
        let onlyManager = false;
        try {
            await campaign.methods.createRequest("Education", accounts[5], 3000).send({
                from: accounts[2],
                gas: 1000000
            })
        } catch(err) {
            onlyManager = true;
        }
        assert.equal(onlyManager, true);
    })

    it('request properties are set properly', async () => {
        await campaign.methods.createRequest("Education", accounts[5], 3000).send({
            from: accounts[1],
            gas: 1000000
        })
        let request = await campaign.methods.requests(0).call();
        assert(request);
        assert.equal(request.description, 'Education');
        assert.equal(request.recipient, accounts[5]);
        assert.equal(request.value, '3000');
        assert.equal(request.completed, false);
        assert.equal(request.noOfApprovals, '0');
    })

    it('only manager can cancel a request', async () => {
        await campaign.methods.createRequest("Education", accounts[5], 3000).send({
            from: accounts[1],
            gas: 1000000
        })
        let onlyManager = false;
        try {
            await campaign.methods.cancelRequest(0).send({
                from: accounts[2],
                gas: 1000000
            })
        } catch(err) {
            onlyManager = true;
        }
        assert.equal(onlyManager, true);
    })

    it('cancel request works fine', async () => {
        await campaign.methods.createRequest("Education", accounts[5], 3000).send({
            from: accounts[1],
            gas: 1000000
        })
        let request = await campaign.methods.requests(0).call();
        assert.equal(request.cancelled, false);
        await campaign.methods.cancelRequest(0).send({
            from: accounts[1],
            gas: 1000000
        })
        request = await campaign.methods.requests(0).call();
        assert.equal(request.cancelled, true);
    })

    it('only contributor can approve a request', async () => {
        let onlyContributor = false;
        await campaign.methods.contribute().send({
            from: accounts[2],
            value: 1000,
            gas: 1000000
        });
        await campaign.methods.createRequest("Education", accounts[5], 3000).send({
            from: accounts[1],
            gas: 1000000
        })

        try {
            await campaign.methods.approveRequest(0).send({
                from: accounts[1],
                gas: 1000000
            })
        } catch(err) {
            onlyContributor = true;
        }
        assert.equal(onlyContributor, true);
    })

    it('request properties checked after approving', async () => {
        await campaign.methods.contribute().send({
            from: accounts[2],
            value: 1000,
            gas: 1000000
        });
        await campaign.methods.createRequest("Education", accounts[5], 3000).send({
            from: accounts[1],
            gas: 1000000
        })
        await campaign.methods.approveRequest(0).send({
            from: accounts[2],
            gas: 1000000
        })
        let request = await campaign.methods.requests(0).call();

        assert.equal(request.noOfApprovals, 1);
    })

    it('same contributor can not approve again', async () => {
        let onlyOnce = true;
        await campaign.methods.contribute().send({
            from: accounts[2],
            value: 1000,
            gas: 1000000
        });
        await campaign.methods.createRequest("Education", accounts[5], 3000).send({
            from: accounts[1],
            gas: 1000000
        })
        try {
            await campaign.methods.approveRequest(0).send({
                from: accounts[2],
                gas: 1000000
            })
            await campaign.methods.approveRequest(0).send({
                from: accounts[2],
                gas: 1000000
            })
        } catch(err) {
            onlyOnce = false;
        }
        assert.equal(onlyOnce, false);
    })
})