import { useRouter } from "next/router";
import { Button, Card, Tab } from "semantic-ui-react";
import factoryContract from "../ethereum/factory";
import Layout from "../components/Layout";

const CampaignIndex = (props) => {
    const panes = [
        { menuItem: 'Open Campaigns', render: () => <Tab.Pane>{renderOpenCampaigns}</Tab.Pane> },
        { menuItem: 'Closed Campaigns', render: () => <Tab.Pane>{renderClosedCampaigns}</Tab.Pane> }
    ]

    const filterOpen = (deadline) => {
        return deadline >= (Date.now() / 1000);
    }

    const router = useRouter();

    const renderOpenCampaigns = props.campaigns
        .filter(campaign => filterOpen(campaign[3]))
        .map((campaign, index) => {
            return (
                <Card.Group key={index}>
                    <Card fluid>
                        <Card.Content>
                            <Card.Header>{campaign[0]}</Card.Header>
                            <Card.Meta>{campaign[2]}</Card.Meta>
                            <Card.Description>{campaign[1]}</Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <Button floated="right" secondary onClick={() => router.push('/campaigns/' + campaign[2])}>View Campaign</Button>
                        </Card.Content>
                    </Card>
                </Card.Group>
            )
        }
    )

    const renderClosedCampaigns = props.campaigns.filter(campaign => !filterOpen(campaign[3])).map((campaign, index) => {
        return (
            <Card.Group key={index}>
                <Card fluid>
                    <Card.Content>
                        <Card.Header>{campaign[0]}</Card.Header>
                        <Card.Meta>{campaign[2]}</Card.Meta>
                        <Card.Description>{campaign[1]}</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                    <Button floated="right" secondary onClick={() => router.push('/campaigns/' + campaign[2])}>View Campaign</Button>
                    </Card.Content>
                </Card>
            </Card.Group>
        )
    })

    return (
        <Layout>
            <div>
                <Tab panes={panes} defaultActiveIndex={0} />
                <Button style={{marginTop: '10px'}} floated="right" content='Create Campaign' icon='add circle' primary onClick={() => router.push('/campaigns/new')} />
            </div>
        </Layout>
    )
}

CampaignIndex.getInitialProps = async () => {
    const campaigns = await factoryContract.methods.getCampaigns().call();

    return { campaigns };
}

export default CampaignIndex;