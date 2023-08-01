import { Row, Col, Container } from 'react-bootstrap';
import LoginForm from './LoginForm';
import Navigation from './Navigation';
import Courses from './Courses';
import PersonalPageLayout from './PersonalPageLayout';
import CreateStudyPlan from './CreateStudyPlan';

function DefaultRoute() {
	return (
		<>
			<Row>
				<Col>
					<h1>Nothing here...</h1>
					<p>This is not the route you are looking for!</p>
				</Col>
			</Row>
		</>
	);
}

function CoursesRoute(props) {
	return (
		<>
			<Navigation studentCode={props.studentCode} loggedIn={props.loggedIn} />
			<Courses courses={props.courses} />
		</>
	);
}

function LoginRoute(props) {
	return (
		<>
			<Navigation />
			<Container className="mt-5">
				<Row>
					<Col>
						<h1>Login</h1>
					</Col>
				</Row>
				<Row>
					<Col>
						<LoginForm login={props.login} />
					</Col>
				</Row>
			</Container>
		</>
	);
}

function StudentRoute(props) {
	return (
		<PersonalPageLayout
			user={props.user}
			loggedIn={props.loggedIn}
			handleLogout={props.handleLogout}
		/>
	);
}

function CreateStudyPlanRoute(props) {
	return (
		<CreateStudyPlan
			setStudyPlanId={props.setStudyPlanId}
			user={props.user}
			courses={props.courses}
			edit={props.edit}
			studyPlan={props.studyPlan}
		/>
	);
}

export {
	DefaultRoute,
	LoginRoute,
	CoursesRoute,
	StudentRoute,
	CreateStudyPlanRoute,
};
