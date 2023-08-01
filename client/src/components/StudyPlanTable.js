import { Table, Container } from 'react-bootstrap';
import StudyPlanCourseRow from './StudyPlanCourseRow';

function StudyPlan(props) {
	return (
		<Container fluid>
			<Table striped>
				<thead>
					<tr>
						<th>Code</th>
						<th>Name</th>
						<th>Credits({props.studyPlan.credits})</th>
						{props.modify && <th>Maximum students number</th>}
						{props.modify && <th>Enrolled students</th>}
						{props.modify && <th>Actions</th>}
					</tr>
				</thead>
				<tbody>
					{props.studyPlan.courses.map((course) => (
						<StudyPlanCourseRow
							deleteCourse={props.deleteCourse}
							course={course}
							key={course.code}
							modify={props.modify}
						/>
					))}
				</tbody>
			</Table>
		</Container>
	);
}

export default StudyPlan;
