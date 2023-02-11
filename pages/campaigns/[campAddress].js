import { useRouter } from "next/router";

const CampaignDetails = (props) => {
    const router = useRouter();

    const campAddress = router.query.campAddress;

    return (
        <div>
            <h1>Hello World!!</h1>
        </div>
    )
}

export default CampaignDetails;