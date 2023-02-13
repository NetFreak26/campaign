import { useRouter } from "next/router";
import { Button } from "semantic-ui-react";
import Layout from "../../../components/Layout"

const Requests = (props) => {
    const router = useRouter();
    const campAddress = router.query.campAddress;
    return (
        <Layout>
            <Button onClick={() => router.push('/campaigns/' + {campAddress} + '/requests/new')} primary>Add Request</Button>
        </Layout>
    )
}

export default Requests;