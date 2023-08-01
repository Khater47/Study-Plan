import Navigation from './Navigation';
import { Container, Row, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import LogoutButton from './LogoutButton';

function PersonalPageLayout(props) {
	return (
		<>
			<Navigation studentCode={props.user.code} loggedIn={props.loggedIn} />
			<Container fluid className="full-height">
				<Row className="justify-content-center full-height">
					<Col className="col-3 pt-5" id="side-bar">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="30%"
							height="30%"
							fill="currentColor"
							className="bi bi-person-bounding-box"
							viewBox="0 0 16 16"
						>
							<path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z" />
							<path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
						</svg>
						<p>{props.user.code}</p>
						<p>
							{props.user.surname} {props.user.name}
						</p>
						{props.loggedIn && <LogoutButton logout={props.handleLogout} />}
					</Col>
					<Col className="col-9 pt-5">
						<Outlet />
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default PersonalPageLayout;
