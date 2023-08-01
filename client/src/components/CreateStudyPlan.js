import StudyPlanTable from './StudyPlanTable';
import { Container, Form, Row, Button, Alert } from 'react-bootstrap';
import { StudyPlan } from '../components/classes/StudyPlan';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from './API';
import SelectOptions from './SelectOptions';

function CreateStudyPlan(props) {
	const [newStudyPlan, setNewStudyPlan] = useState(() => {
		return new StudyPlan(
			props.studyPlan ? props.studyPlan.id : null,
			props.studyPlan ? props.studyPlan.type : '',
			props.studyPlan ? props.studyPlan.credits : 0,
			props.studyPlan ? props.studyPlan.courses : []
		);
	});
	const [selectedCourseId, setSelectedCourseId] = useState();
	const [newStudyPlanType, setNewStudyPlanType] = useState(() => {
		return props.studyPlan ? props.studyPlan.type : 'Full-Time';
	});
	const [errMessage, setErrMessage] = useState(null);
	const [optionsListCourses, setOptionsListCourses] = useState(() =>
		props.courses.filter((course) => !newStudyPlan.courses.includes(course))
	);
	const navigate = useNavigate();

	const deleteCourse = (courseToDelete) => {
		const dependentCourse = newStudyPlan.courses.find((course) => {
			return course.preparatoryCourse === courseToDelete.code;
		});
		if (dependentCourse) {
			const errMessage = `"${dependentCourse.name}" has this course as a preparatory course, delete "${dependentCourse.name}" first.`;
			setErrMessage(errMessage);
		} else {
			setNewStudyPlan(() => {
				const tempStudyPlan = new StudyPlan(null, '', 0, []);
				tempStudyPlan.courses = newStudyPlan.courses.filter(
					(course) => course.code !== courseToDelete.code
				);
				tempStudyPlan.credits = newStudyPlan.credits - courseToDelete.credits;
				return tempStudyPlan;
			});
		}
		return;
	};

	const addCourse = () => {
		let errMessage;
		if (!selectedCourseId) return;
		const addedCourse = props.courses.find(
			(course) => course.code === selectedCourseId
		);
		if (
			addedCourse.maxStudentsNumber &&
			addedCourse.enrolledStudents.length === addedCourse.maxStudentsNumber
		) {
			errMessage = `"${addedCourse.name}" Maximum number of students reached, can't accept more students`;
			setErrMessage(errMessage);
			return;
		}
		const computeStudyPlanCredits = (courses) => {
			let credits = 0;
			for (let i = 0; i < courses.length; i++) {
				credits += courses[i].credits;
			}
			return credits;
		};
		setNewStudyPlan(() => {
			const tempStudyPlan = new StudyPlan(null, '', 0, []);
			tempStudyPlan.courses = [...newStudyPlan.courses];
			tempStudyPlan.courses.push(addedCourse);
			tempStudyPlan.credits = computeStudyPlanCredits(tempStudyPlan.courses);
			return tempStudyPlan;
		});
		setSelectedCourseId();
	};

	const handleSubmit = (event) => {
		const finalStudyPlan = new StudyPlan(
			props.edit ? newStudyPlan.id : null,
			newStudyPlanType,
			newStudyPlan.credits,
			[...newStudyPlan.courses]
		);
		event.preventDefault();
		setErrMessage(null);
		let errMessage;

		// check study plan credits constraints
		if (
			finalStudyPlan.type === 'Full-Time' &&
			(finalStudyPlan.credits < 20 || finalStudyPlan.credits > 80)
		) {
			errMessage =
				'Full-Time Study Plan must range from 20 to 80 credits (Extrems Included)';
			setErrMessage(errMessage);
			return;
		}

		if (
			finalStudyPlan.type === 'Part-Time' &&
			(finalStudyPlan.credits < 20 || finalStudyPlan.credits > 40)
		) {
			errMessage =
				'Part-Time Study Plan must range from 20 to 40 credits (Extrems Included)';
			setErrMessage(errMessage);
			return;
		}

		//Checks of courses constraints
		const codes = finalStudyPlan.courses.map((course) => course.code);
		let preparatoryCourseCheck = true;
		let incompatibleCoursesCheck = true;
		for (
			let i = 0;
			i < finalStudyPlan.courses.length &&
			preparatoryCourseCheck &&
			incompatibleCoursesCheck;
			i++
		) {
			if (finalStudyPlan.courses[i].preparatoryCourse !== null) {
				if (!codes.includes(finalStudyPlan.courses[i].preparatoryCourse)) {
					preparatoryCourseCheck = false;
					const name = finalStudyPlan.courses[i].name;
					const requiredCourse = props.courses.find(
						(course) =>
							course.code === finalStudyPlan.courses[i].preparatoryCourse
					).name;
					errMessage = `"${name}"requires "${requiredCourse}" to be in the study plan.`;
					setErrMessage(errMessage);
					return;
				}
			}
			for (
				let j = 0;
				j < finalStudyPlan.courses[i].incompatibleCourses.length &&
				incompatibleCoursesCheck;
				j++
			) {
				if (codes.includes(finalStudyPlan.courses[i].incompatibleCourses[j])) {
					incompatibleCoursesCheck = false;
					errMessage = `Study Plan can't contain both courses "${
						finalStudyPlan.courses[i].name
					}" and "${
						finalStudyPlan.courses.find(
							(course) =>
								finalStudyPlan.courses[i].incompatibleCourses[j] === course.code
						).name
					}" to be in the study plan.`;
					setErrMessage(errMessage);
					return;
				}
			}
		}

		//setup things to load correctly in next page
		const setupAfterCreate = async () => {
			const insertedStudyPlanId = await API.createStudyPlan(
				props.user.code,
				finalStudyPlan
			);
			props.setStudyPlanId(insertedStudyPlanId);
		};

		const setupAfterUpdate = async () => {
			await API.createStudyPlan(props.user.code, finalStudyPlan);
			props.setStudyPlanId(finalStudyPlan.id);
		};

		props.edit ? setupAfterUpdate() : setupAfterCreate();

		navigate(`/students/${props.user.code}/studyPlan`);
		return;
	};

	return (
		<Container fluid>
			<Row>
				{errMessage && <Alert variant="danger">{errMessage}</Alert>}
				<h1>{props.edit ? 'Edit' : 'Create new'} Study Plan</h1>
			</Row>
			<Row>
				<Form className="my-5" onSubmit={handleSubmit}>
					<Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>Study Plan Type</Form.Label>
							<Form.Select
								value={newStudyPlanType}
								onChange={(event) => {
									setNewStudyPlanType(event.target.value);
								}}
							>
								<option value="Full-Time">Full-Time</option>
								<option value="Part-Time">Part-Time</option>
							</Form.Select>
							<Form.Text className="text-muted">
								{newStudyPlanType === 'Full-Time'
									? 'Credits must be in range [20-80]'
									: 'Credits must be in range [20-40]'}
							</Form.Text>
						</Form.Group>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Course</Form.Label>
						<Form.Select
							value={selectedCourseId}
							defaultValue="Select Course"
							onChange={(event) => {
								setSelectedCourseId(event.target.value);
							}}
						>
							<SelectOptions
								setOptionsListCourses={setOptionsListCourses}
								optionsListCourses={optionsListCourses}
								courses={props.courses}
								studyPlan={newStudyPlan}
							/>
						</Form.Select>
					</Form.Group>
					<Container fluid className="d-flex justify-content-between mb-3">
						<Link to={`/students/${props.user.code}/StudyPlan`}>
							<Button variant="danger" size="lg">
								Cancel
							</Button>
						</Link>
						<Button variant="success" type="submit" size="lg">
							Finish
						</Button>
						<Button
							variant="primary"
							size="lg"
							onClick={() => {
								addCourse();
							}}
						>
							Add Course
						</Button>
					</Container>
				</Form>
			</Row>
			<Row>
				<StudyPlanTable
					deleteCourse={deleteCourse}
					studyPlan={newStudyPlan}
					modify={true}
				/>
			</Row>
		</Container>
	);
}

export default CreateStudyPlan;
