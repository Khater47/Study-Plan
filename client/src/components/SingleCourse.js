import { Accordion } from 'react-bootstrap';

function SingleCourse(props) {
	return (
		<Accordion.Item eventKey={props.course.code}>
			<Accordion.Header>{props.course.name}</Accordion.Header>
			<Accordion.Body>
				<p>Code: "{props.course.code}"</p>
				<p>CFU: {props.course.credits}</p>
				<p>Students enrolled: {props.course.enrolledStudents.length}</p>
				{props.course.maxStudentsNumber ? (
					<p>Maximum number of students: {props.course.maxStudentsNumber}</p>
				) : null}
				{props.course.preparatoryCourse ? (
					<p>Preparatory Course: "{props.course.preparatoryCourse}"</p>
				) : (
					props.course.preparatoryCourse
				)}
				{props.course.incompatibleCourses.length > 0 ? (
					<p>
						Incompatible Courses :[{props.course.incompatibleCourses.join(', ')}
						]
					</p>
				) : null}
			</Accordion.Body>
		</Accordion.Item>
	);
}

export default SingleCourse;
