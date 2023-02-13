import { useRouter } from "next/router";
import { useState } from "react";
import { Form, Input, TextArea, Header, Button, Message } from "semantic-ui-react";
import Layout from "../../../../components/Layout";
import Campaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";

const CreateRequestTemplate = () => {

    const [ state, setState ] = useState({
        description: "",
        recipient: "",
        value: ""
    });
    const [ loading, setLoading ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");

    const router = useRouter();
    const campAddress = router.query.campAddress;

    const campaign = Campaign(campAddress);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setState((previousState) => ({
            ...previousState,
            [name]: value
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            setErrorMessage("");
            const accounts = await web3.eth.getAccounts();
            
            await campaign.methods
                    .createRequest(state.description, state.recipient, state.value)
                    .send({from: accounts[0]});
            router.push('/campaigns/' + campAddress + '/requests');
        } catch (err) {
            setErrorMessage(err.message);
        }
        setLoading(false);
    }
    return (
        <Layout>
            <Header
                as='h1'
                content='Create Request'
                subheader={campAddress}
                dividing
            />
            <Form onSubmit={handleSubmit}>
                <Form.Field>
                    <label>Description</label>
                    <TextArea 
                        name='description'
                        value={state.description}
                        onChange={handleChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Recipient</label>
                    <Input 
                        name='recipient'
                        value={state.recipient}
                        onChange={handleChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Amount</label>
                    <Input 
                        name='value'
                        value={state.value}
                        onChange={handleChange}
                        type='number'
                        label="wei"
                        labelPosition="right"
                    />
                </Form.Field>

                <Message error header="Oops!!!" content={errorMessage} />

                <Button loading={loading} style={{marginTop: '10px'}} floated="right" content='Add Request' icon='add circle' primary />
            </Form>
        </Layout>
    )
}

export default CreateRequestTemplate;