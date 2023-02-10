import { Container } from "semantic-ui-react";
import Header from "./Header";
import 'semantic-ui-css/semantic.min.css';

const Layout = (props) => {
    return (
        <Container style ={{  }}>
            <Header />
            {props.children}
        </Container>
    )
}

export default Layout;