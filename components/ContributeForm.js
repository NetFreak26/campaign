import { useState } from "react";
import { Form, Input, Button, Message} from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";

const ContributeForm = (props) => {

    const [ loading, setLoading ] = useState(false);
    const [ value, setValue ] = useState('');
    const [ errorMessage, setErrorMessage ] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            setErrorMessage("");
            const accounts = await web3.eth.getAccounts();
            const campaign = Campaign(props.address);

            await campaign.methods.contribute()
                .send({from: accounts[0], value: value});

            setValue("");
            props.onFinish();
        } catch (err) {
            setErrorMessage(err.message);
        }
        setLoading(false);
    }

    return (
        <Form onSubmit={handleSubmit} error={errorMessage !== undefined && errorMessage.length>0}>
            <Form.Field>
                <label>Amount To Contribute</label>
                <Input 
                    label='wei' 
                    labelPosition="right" 
                    type="number" min={props.minimumContribution}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                />
            </Form.Field>
            <Message error header="Oops!!!" content={"Campaign deadline expired!!!"} />
            <Button loading={loading} floated="right" content='Contribute!' primary />
        </Form>
    )
}

export default ContributeForm;