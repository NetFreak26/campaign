const { Menu, Button } = require("semantic-ui-react");
import { useRouter } from "next/router";

const Header = () => {
    const router = useRouter();
    return (
        <Menu style = {{ marginTop: '10px' }}>
            <Menu.Item onClick={() => router.push('/')}>
                CrowdCoins             
            </Menu.Item>
            <Menu.Menu position="right">
                <Menu.Item onClick={() => router.push('/')}>
                    Campaigns  
                </Menu.Item>
                <Menu.Item onClick={() => router.push('/campaigns/new')}>
                    +
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    )
}

export default Header;