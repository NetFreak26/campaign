import { useEffect } from "react";
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
                            <Button>View Campaign</Button>
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
                        <Button>View Campaign</Button>
                    </Card.Content>
                </Card>
            </Card.Group>
        )
    })

    return (
        <Layout>
            <div>
                <Tab panes={panes} defaultActiveIndex={0} />
                <div>
                    <Button content='Create Campaign' icon='add' primary />
                </div>
            </div>
        </Layout>
    )
}

CampaignIndex.getInitialProps = async () => {
    const campaigns = await factoryContract.methods.getCampaigns().call();

    return { campaigns };
}

export default CampaignIndex;