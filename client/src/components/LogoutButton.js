import { Row, Col, Button } from 'react-bootstrap';

function LogoutButton(props) {
	return (
		<Row>
			<Col>
				<Button variant="outline-primary" onClick={props.logout}>
					Logout
				</Button>
			</Col>
		</Row>
	);
}

export default LogoutButton;
