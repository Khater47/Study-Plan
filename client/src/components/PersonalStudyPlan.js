import StudyPlanTable from './StudyPlanTable';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import StudyPlanActions from './StudyPlanActions';

function PersonalStudyPlan(props) {
	return props.studyPlanId ? (
		<Container fluid>
			<h1>Personal Study Plan ({props.studyPlan.type})</h1>
			<StudyPlanTable studyPlan={props.studyPlan} />
			<StudyPlanActions
				studyPlan={props.studyPlan}
				user={props.user}
				deleteStudyPlan={props.deleteStudyPlan}
			/>
		</Container>
	) : (
		<Link to={`/students/${props.user.code}/studyPlan/create`}>
			<Button variant="primary" size="lg">
				Create Study Plan
			</Button>
		</Link>
	);
}

export default PersonalStudyPlan;
