import { Accordion, Container } from 'react-bootstrap';
import SingleCourse from './SingleCourse';

function Courses(props) {
	return (
		<Container className="mt-5">
			<h1>Courses list ({props.courses.length})</h1>
			<Accordion alwaysOpen>
				{props.courses.map((course) => (
					<SingleCourse course={course} key={course.code} />
				))}
			</Accordion>
		</Container>
	);
}

export default Courses;
