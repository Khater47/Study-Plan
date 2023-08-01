import { Trash3Fill } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';

function CourseData(props) {
	return (
		<>
			<td>{props.course.code}</td>
			<td>{props.course.name}</td>
			<td>{props.course.credits}</td>
			{props.modify && (
				<td>
					{props.course.maxStudentsNumber ? props.course.maxStudentsNumber : ''}
				</td>
			)}
			{props.modify && (
				<td>
					{props.course.maxStudentsNumber
						? props.course.enrolledStudents.length
						: ''}
				</td>
			)}
			{props.modify && (
				<td>
					<Button
						variant="danger"
						onClick={() => {
							props.deleteCourse(props.course);
						}}
					>
						<Trash3Fill />
					</Button>
				</td>
			)}
		</>
	);
}

export default CourseData;
