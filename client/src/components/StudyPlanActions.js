import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Trash3Fill, PencilSquare } from 'react-bootstrap-icons';

function StudyPlanActions(props) {
	return (
		<Container fluid className="d-flex justify-content-between">
			<Button
				size="lg"
				variant="danger"
				onClick={() => {
					props.deleteStudyPlan(props.user.code, props.studyPlan.id);
				}}
			>
				<Trash3Fill />
			</Button>

			<Link to={`/students/${props.user.code}/studyPlan/edit`}>
				<Button size="lg" variant="primary">
					<PencilSquare />
				</Button>
			</Link>
		</Container>
	);
}

export default StudyPlanActions;
