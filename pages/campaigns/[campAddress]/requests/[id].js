import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Table } from "semantic-ui-react";
import Layout from "../../../../components/Layout";
import Campaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";

const Request = (props) => {

    const [ loading, setLoading ] = useState({
        approve: false,
        cancel: false,
        finalise: false
    });

    const [ errorMessage, setErrorMessage ] = useState("");

    const router = useRouter();

    const id = router.query.id;

    const campAddress = router.query.campAddress;

    const campaign = Campaign(campAddress);

    const approve = async () => {
        setLoading((previousState) => {
            return {
                ...previousState,
                approve: true
            }
        });
        setErrorMessage("");
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.approveRequest(parseInt(id)).send({
                from: accounts[0]
            })
        } catch(err) {
            setErrorMessage(err.message);
            console.log(err);
        }
        setLoading((previousState) => {
            return {
                ...previousState,
                approve: false
            }
        });
    }

    const cancel = async () => {
        setLoading((previousState) => {
            return {
                ...previousState,
                cancel: true
            }
        });
        setErrorMessage("");
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.cancelRequest(parseInt(id)).send({
                from: accounts[0]
            })
        } catch(err) {
            setErrorMessage(err.message);
            console.log(err.message);
        }
        setLoading((previousState) => {
            return {
                ...previousState,
                cancel: false
            }
        });
    }

    const finalise = async () => {
        setLoading((previousState) => {
            return {
                ...previousState,
                finalise: true
            }
        });
        setErrorMessage("");
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.finaliseRequest(parseInt(id)).send({
                from: accounts[0]
            })
        } catch(err) {
            setErrorMessage(err.message);
            console.log(err.message);
        }
        setLoading((previousState) => {
            return {
                ...previousState,
                finalise: false
            }
        });
    }

    return (
        <Layout>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan='2'>Request</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    <Table.Row>
                        <Table.Cell>Description</Table.Cell>
                        <Table.Cell>{props.request.description}</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell>Recipient</Table.Cell>
                        <Table.Cell>{props.request.recipient}</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell>Amount (in wei)</Table.Cell>
                        <Table.Cell>{props.request.value}</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell>Approvals Count</Table.Cell>
                        <Table.Cell>{props.request.noOfApprovals} / {props.noOfContributors}</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>


            <Button secondary floated="right" onClick={finalise} loading={loading.finalise}>Finalise</Button>

            <Button negative floated="right" onClick={cancel} loading={loading.cancel}>Cancel</Button>

            <Button primary floated="right" onClick={approve} loading={loading.approve}>Approve</Button>
        </Layout>
    )
}

Request.getInitialProps = async ({query}) => {
    const {id} = query;
    const { campAddress } = query;
    const campaign = Campaign(campAddress);
    const request = await campaign.methods.requests(id).call();
    const noOfContributors = await campaign.methods.noOfContributors().call();

    return { request, noOfContributors }
}

export default Request;