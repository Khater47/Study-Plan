import './App.css';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import API from './components/API';
import { useState, useEffect } from 'react';
import {
	LoginRoute,
	CoursesRoute,
	DefaultRoute,
	StudentRoute,
	CreateStudyPlanRoute,
} from './components/StudyPlanViews';
import { StudyPlan } from './components/classes/StudyPlan';
import PersonalStudyPlan from './components/PersonalStudyPlan';

function App() {
	const [loggedIn, setLoggedIn] = useState(false);
	const [courses, setCourses] = useState([]);
	const [user, setUser] = useState({});
	const [studyPlan, setStudyPlan] = useState(new StudyPlan());
	const [studyPlanId, setStudyPlanId] = useState(null);

	useEffect(() => {
		const checkAuth = async () => {
			const user = await API.getUserInfo();
			if (user) {
				setLoggedIn(true);
				setUser({
					code: user.code,
					name: user.name,
					surname: user.surname,
					email: user.email,
				});
				const updatedUser = await API.getUserByCode(user.code);
				setStudyPlanId(updatedUser.studyPlanId);
				const studyPlan = await API.getStudyPlan(updatedUser.code, studyPlanId);
				setStudyPlan(studyPlan);
			}
		};
		checkAuth();
	}, [studyPlanId]);

	//side effect to run only once when the application is rerendered to keep user logged in after a reftesh

	useEffect(() => {
		loadCourses();
	}, []);

	//side effect to run only once when the application is rerendered to load user data after a reftesh
	const loadCourses = () => {
		API.getCourses().then((courses) => {
			setCourses(courses);
		});
	};

	//method to handle the login in the login form
	const handleLogin = async (credentials) => {
		try {
			const user = await API.logIn(credentials);
			setLoggedIn(true);
			setUser(user);
			const studyPlan = await API.getStudyPlan(user.code, user.studyPlanId);
			setStudyPlan(studyPlan);
			setStudyPlanId(studyPlan.id);
		} catch (err) {
			console.log(err);
		}
	};

	//method to handle delete the whole studyPlan
	const deleteStudyPlan = async (studentCode, studyPlanId) => {
		try {
			setStudyPlan(new StudyPlan());
			setStudyPlanId(null);
			await API.deleteStudyPlan(studentCode, studyPlanId);
		} catch (err) {
			console.log(err);
		}
	};

	//method to handle the logout
	const handleLogout = async () => {
		await API.logOut();
		setLoggedIn(false);
		// clean up everything
		setUser(null);
		setStudyPlan(new StudyPlan());
		setStudyPlanId(null);
	};

	return (
		<Container fluid className="App px-0 full-height">
			<BrowserRouter>
				<Routes>
					<Route
						path="/login"
						element={
							loggedIn ? (
								<Navigate to={`/students/${user.code}/studyPlan`} replace />
							) : (
								<LoginRoute login={handleLogin} />
							)
						}
					/>
					<Route
						path="/"
						element={
							loggedIn ? (
								<Navigate to={`/students/${user.code}/studyPlan`} replace />
							) : (
								<Navigate to="/courses" replace />
							)
						}
					/>
					<Route
						path="/students/:studentId/studyPlan"
						element={
							loggedIn ? (
								<StudentRoute
									loggedIn={loggedIn}
									handleLogout={handleLogout}
									user={user}
								/>
							) : (
								<Navigate to="/login" replace />
							)
						}
					>
						<Route
							index
							element={
								loggedIn ? (
									<PersonalStudyPlan
										user={user}
										studyPlan={studyPlan}
										studyPlanId={studyPlanId}
										deleteStudyPlan={deleteStudyPlan}
									/>
								) : (
									<Navigate to="/login" replace />
								)
							}
						/>
						<Route
							path="create"
							element={
								<CreateStudyPlanRoute
									user={user}
									courses={courses}
									setStudyPlanId={setStudyPlanId}
								/>
							}
						/>
						<Route
							path="edit"
							element={
								<CreateStudyPlanRoute
									user={user}
									courses={courses}
									studyPlan={studyPlan}
									setStudyPlanId={setStudyPlanId}
									edit={true}
								/>
							}
						/>
					</Route>
					<Route
						path="/courses"
						element={
							<CoursesRoute
								studentCode={user ? user.code : ''}
								loggedIn={loggedIn}
								courses={courses}
							/>
						}
					/>
					<Route path="*" element={<DefaultRoute />} />
				</Routes>
			</BrowserRouter>
		</Container>
	);
}

export default App;
