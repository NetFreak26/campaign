const { Menu } = require("semantic-ui-react")

const Header = () => {
    return (
        <Menu style = {{ marginTop: '10px' }}>
            <Menu.Item>
                CrowdCoins
            </Menu.Item>
            <Menu.Menu position="right">
                <Menu.Item>
                    Campaigns
                </Menu.Item>
                <Menu.Item>
                    +
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    )
}

export default Header;