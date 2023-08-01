// import { useState } from 'react';

function SelectOptions(props) {
	const handleSelectOptions = () => {
		let optionListCourses = [];
		let found = false;
		if (props.studyPlan.courses.length > 0) {
			for (let i = 0; i < props.courses.length; i++) {
				for (let j = 0; j < props.studyPlan.courses.length && !found; j++) {
					if (props.courses[i].code === props.studyPlan.courses[j].code) {
						found = true;
					}
				}
				if (found === false) {
					optionListCourses.push(props.courses[i]);
				} else {
					found = false;
				}
			}
		} else {
			optionListCourses = props.courses;
		}

		/* Checks of courses constraints */
		// add error message to courses
		optionListCourses.map((course) => (course.errMessage = null));

		const studyPlanCoursesCodes = props.studyPlan.courses.map(
			(course) => course.code
		); //codes of courses that are in the study plan

		for (let i = 0; i < optionListCourses.length; i++) {
			// check if the course has a preparatory course of not, if true check if that preparatory course already in the study plan or not.
			// if the preparatory course is not in the study plan, get his name and prepare error
			if (optionListCourses[i].preparatoryCourse !== null) {
				if (
					!studyPlanCoursesCodes.includes(
						optionListCourses[i].preparatoryCourse
					)
				) {
					const requiredCourse = props.courses.find(
						(course) => course.code === optionListCourses[i].preparatoryCourse
					).name;
					//adding error message to the course to print it
					optionListCourses[
						i
					].errMessage = `(requires "${requiredCourse}" to be added in the study plan first.)`;
				}
			}
			//if the course has an incombatible courses list go through the list
			for (
				let j = 0;
				j < optionListCourses[i].incompatibleCourses.length;
				j++
			) {
				//check if the incombatible course exist in the study plan, if true prepare error meassage
				if (
					studyPlanCoursesCodes.includes(
						optionListCourses[i].incompatibleCourses[j]
					)
				) {
					const conflictCourseName = props.studyPlan.courses.find(
						(course) =>
							course.code === optionListCourses[i].incompatibleCourses[j]
					).name;
					optionListCourses[
						i
					].errMessage = `(Conflicts with "${conflictCourseName}".)`;
				}
			}
		}

		const selectOptions = optionListCourses.map((course) => {
			return (
				<option
					key={course.code}
					value={course.code}
					disabled={course.errMessage ? true : false}
					className={course.errMessage ? 'errMessage' : ''}
				>
					{`${course.code} ${course.name} ${
						course.errMessage ? course.errMessage : ''
					}`}
				</option>
			);
		});
		return selectOptions;
	};
	return (
		<>
			<option key={0} value="Select Course">
				Select Course
			</option>
			{handleSelectOptions()}
		</>
	);
}

export default SelectOptions;
