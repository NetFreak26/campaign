import { useRouter } from "next/router";
import { Button, Tab, Table } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import Campaign from "../../../ethereum/campaign";

const Requests = (props) => {
    const router = useRouter();
    const campAddress = router.query.campAddress;

    const panes = [
        { menuItem: 'Open Requests', render: () => <Tab.Pane>{renderOpenRequests}</Tab.Pane> },
        { menuItem: 'Completed Requests', render: () => <Tab.Pane>{renderCompletedRequests}</Tab.Pane> },
        { menuItem: 'Cancelled Requests', render: () => <Tab.Pane>{renderCancelledRequests}</Tab.Pane> }
    ]
    const renderOpenRequests = (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.HeaderCell>Description</Table.HeaderCell>
                    <Table.HeaderCell>Recipient</Table.HeaderCell>
                    <Table.HeaderCell>Amount(in wei)</Table.HeaderCell>
                    <Table.HeaderCell>Approval Count</Table.HeaderCell>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {props.requests
                    .filter(request => request[4] == false && request[5] == false)
                    .map((request, index) => {
                        return (
                            <Table.Row key={index}>
                                <Table.Cell>{index+1}</Table.Cell>
                                <Table.Cell>{request[1]}</Table.Cell>
                                <Table.Cell>{request[2]}</Table.Cell>
                                <Table.Cell>{request[3]}</Table.Cell>
                                <Table.Cell>{request[6]} / {props.noOfContributors}</Table.Cell>
                                <Table.Cell>
                                    <Button secondary onClick={() => router.push('/campaigns/' + campAddress + '/requests/' + request[0])} >View</Button>
                                </Table.Cell>
                            </Table.Row>
                        )
                    })
                }
            </Table.Body>
        </Table>
    );

    const renderCompletedRequests = (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.HeaderCell>Description</Table.HeaderCell>
                    <Table.HeaderCell>Recipient</Table.HeaderCell>
                    <Table.HeaderCell>Amount(in wei)</Table.HeaderCell>
                    <Table.HeaderCell>Approval Count</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {props.requests
                    .filter(request => request[4] == true)
                    .map((request, index) => {
                        return (
                            <Table.Row key={index}>
                                <Table.Cell>{index+1}</Table.Cell>
                                <Table.Cell>{request[1]}</Table.Cell>
                                <Table.Cell>{request[2]}</Table.Cell>
                                <Table.Cell>{request[3]}</Table.Cell>
                                <Table.Cell>{request[6]}</Table.Cell>
                                <Table.Cell>Completed</Table.Cell>
                            </Table.Row>
                        )
                    })
                }
            </Table.Body>
        </Table>
    );

    const renderCancelledRequests = (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.HeaderCell>Description</Table.HeaderCell>
                    <Table.HeaderCell>Recipient</Table.HeaderCell>
                    <Table.HeaderCell>Amount(in wei)</Table.HeaderCell>
                    <Table.HeaderCell>Approval Count</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {props.requests
                    .filter(request => request[5] == true)
                    .map((request, index) => {
                        return (
                            <Table.Row key={index}>
                                <Table.Cell>{index+1}</Table.Cell>
                                <Table.Cell>{request[1]}</Table.Cell>
                                <Table.Cell>{request[2]}</Table.Cell>
                                <Table.Cell>{request[3]}</Table.Cell>
                                <Table.Cell>{request[6]}</Table.Cell>
                                <Table.Cell>Cancelled</Table.Cell>
                            </Table.Row>
                        )
                    })
                }
            </Table.Body>
        </Table>
    );
    return (
        <Layout>
            <Button floated="right" onClick={() => router.push('/campaigns/' + campAddress + '/requests/new')} primary>Add Request</Button>
            <Tab panes={panes} defaultActiveIndex={0} />
        </Layout>
    )
}

Requests.getInitialProps = async ({query}) => {
    const { campAddress } = query;
    const campaign = Campaign(campAddress);
    const requests = await campaign.methods.getRequests().call();

    const noOfContributors = await campaign.methods.noOfContributors().call();
    return { requests, noOfContributors };
}

export default Requests;