import Layout from "../../components/Layout";
import { Form, Input, TextArea, Button, Dropdown} from "semantic-ui-react";
import { useState } from "react";
import factoryContract from "../../ethereum/factory";
import web3 from "../../ethereum/web3";

const CreateCampaignTemplate = () => {

    const [ campaignStates, setCampaignStates ] =  useState({
        campaignName: "",
        campaignDescription: "",
        minimumContribution: "",
        target: "",
        deadline: ""
    })

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setCampaignStates((previousStates) => ({
            ...previousStates,
            [name]: value
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(campaignStates);
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
        await factoryContract.methods
                .createCampaign(campaignStates.campaignName, campaignStates.campaignDescription, campaignStates.minimumContribution, campaignStates.target, campaignStates.deadline);
    }

    return (
        <Layout>
            <Form onSubmit={handleSubmit}>
                <Form.Field
                    id='campaignName'
                    control={Input}
                    label='Enter Your Campaign Name'
                    name='campaignName'
                    value={campaignStates.campaignName}
                    onChange={handleChange}
                    placeholder='Campaign Name'
                />
                <Form.Field
                    id='campaignDescription'
                    control={TextArea}
                    label='Enter Your Campaign Description'
                    name='campaignDescription'
                    value={campaignStates.campaignDescription}
                    onChange={handleChange}
                    placeholder='Campaign Description'
                />
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label htmlFor='minimumContribution'>Minimum Amount</label>
                        <Input 
                            id='minimumContribution' 
                            label='wei' 
                            labelPosition="right" 
                            type="number" min='1'
                            name='minimumContribution'
                            value={campaignStates.minimumContribution}
                            onChange={handleChange}
                    />
                    </Form.Field>
                    <Form.Field>
                        <label htmlFor='target'>Target Amount</label>
                        <Input 
                            id='target' 
                            label='wei' 
                            labelPosition="right" 
                            type="number" min='1000'
                            name='target'
                            value={campaignStates.target}
                            onChange={handleChange}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Field>
                    <label htmlFor="deadline">For how long you want your campaign to be active?</label>
                    <Input
                        label='seconds'
                        type='number'
                        min='0'
                        id='deadline'
                        labelPosition='right'
                        name='deadline'
                        value={campaignStates.deadline}
                        onChange={handleChange}
                    />
                </Form.Field>

                <Button floated="right" content='Add Campaign' icon='add' primary />
            </Form>
        </Layout>
    )

}

export default CreateCampaignTemplate;