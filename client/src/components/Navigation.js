import { Navbar, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function Navigation(props) {
	return (
		<Navbar bg="dark" variant="dark">
			<Container>
				<Navbar.Brand>University</Navbar.Brand>
				<NavLink className="routerLink" to="/courses">
					Courses
				</NavLink>
				{props.loggedIn ? (
					<NavLink
						className="routerLink"
						to={`/students/${props.studentCode}/studyPlan`}
					>
						Study Plan
					</NavLink>
				) : null}
				{!props.loggedIn ? (
					<NavLink className="routerLink" to="/login">
						Login
					</NavLink>
				) : null}
			</Container>
		</Navbar>
	);
}

export default Navigation;
