import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import Campaign from "../../../ethereum/campaign";
import { Card, Header, Button, Grid } from "semantic-ui-react";
import ContributeForm from "../../../components/ContributeForm";
import { useState } from "react";
import Status from "../../../components/Status";



const CampaignDetails = (props) => {

    const router = useRouter();
    const campAddress = router.query.campAddress;

    const [campaignName, setCampaignName] = useState(props.campaignName);
    const [campaignDescription, setCampaignDescription] = useState(props.campaignDescription);
    const [manager, setManager] = useState(props.manager);
    const [minimumContribution, setMinimumContribution] = useState(props.minimumContribution);
    const [target, setTarget] = useState(props.target)
    const [deadline, setDeadline] = useState(props.deadline);
    const [noOfContributors, setNoOfContributors] = useState(props.noOfContributors);
    const [totalContribution, setTotalContribution] = useState(props.totalContribution);
    const [balance, setBalance] = useState(props.balance);
    const [noOfRequests, setNoOfRequests] = useState(props.noOfRequests);

    const onFinish = async () => {
        const campaign = Campaign(campAddress);
        const summary = await campaign.methods.getSummary().call();

        setCampaignName(summary[0]);
        setCampaignDescription(summary[1]);
        setManager(summary[2]);
        setMinimumContribution(summary[3]);
        setTarget(summary[4]);
        setDeadline(summary[5]);
        setNoOfContributors(summary[6]);
        setTotalContribution(summary[7]);
        setBalance(summary[8]);
        setNoOfRequests(summary[9]);
    }

    const items = [{
        header: manager,
        meta: 'Address of Manager',
        description: 'The manager created the request and can create requests',
        style: { overflowWrap: 'break-word' }
    }, {
        header: minimumContribution,
        meta: 'Minimum Contribution (in wei)',
        description: 'You must contribute atleast this much wei to become a contributor'
    }, {
        header: target,
        meta: 'Target Amount (in wei)',
        description: 'This campaign is set to collect this much wei'
    }, {
        header: noOfContributors,
        meta: 'Number of Contributors',
        description: 'No of contributors who has contributed till now',
    }, {
        header: totalContribution,
        meta: 'Total Raised (in wei)',
        description: 'This campaign has raised this much amount till now'
    }, {
        header: balance,
        meta: 'Current Balance available (in wei)',
        description: 'This campaign has this much wei left'
    }]
    
    return (
        <Layout>
            <Header
                as='h1'
                content={campaignName}
                subheader={campAddress}
                dividing
            />

            <Header
                as='h3'
                content='Summary'
                subheader={campaignDescription}
            />

            <br />
            <br />
            <Grid>
                <Grid.Column width={9}>
                    <Card.Group items={items}></Card.Group>
                    <Card.Group>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{noOfRequests}</Card.Header>
                                <Card.Meta>Number of Requests</Card.Meta>
                                <Card.Description>A request is raised by manager to withdraw money from campaign. A request must be approved by atleast 50% contributors to withdraw money.</Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <Button floated="right" secondary onClick={() => router.push('/campaigns/' + campAddress + '/requests')}>View Requests</Button>
                            </Card.Content>
                        </Card>
                    </Card.Group>
                </Grid.Column>
                <Grid.Column width={6}>
                    <ContributeForm address={campAddress} minimumContribution={minimumContribution} onFinish={onFinish}/>
                    <Status deadline={deadline} />
                </Grid.Column>
            </Grid>
        </Layout>
    )
}

CampaignDetails.getInitialProps = async({ query }) => {

    const { campAddress } = query;
    const campaign = Campaign(campAddress);
    const summary = await campaign.methods.getSummary().call();

    return {
        campaignName: summary[0],
        campaignDescription: summary[1],
        manager: summary[2],
        minimumContribution: summary[3],
        target: summary[4],
        deadline: summary[5],
        noOfContributors: summary[6],
        totalContribution: summary[7],
        balance: summary[8],
        noOfRequests: summary[9]
    };
}

export default CampaignDetails;