import CourseData from './CourseData';

function StudyPlanCourseRow(props) {
	return (
		<tr>
			<CourseData
				deleteCourse={props.deleteCourse}
				course={props.course}
				modify={props.modify}
			/>
		</tr>
	);
}

export default StudyPlanCourseRow;
