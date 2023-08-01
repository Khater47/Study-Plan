import { StudyPlan } from './classes/StudyPlan';

const SERVER_URL = 'http://localhost:3001';
const fetch = require('node-fetch');

const logIn = async (credentials) => {
	const response = await fetch(SERVER_URL + '/api/sessions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify(credentials),
	});
	if (response.ok) {
		const user = await response.json();
		return user;
	} else {
		const errDetails = await response.text();
		throw errDetails;
	}
};

const getUserInfo = async () => {
	const response = await fetch(SERVER_URL + '/api/sessions/current', {
		credentials: 'include',
	});
	if (response.ok) {
		const user = await response.json();
		return user;
	}
};

const getUserByCode = async (studentCode) => {
	const response = await fetch(SERVER_URL + `/api/students/${studentCode}`, {
		credentials: 'include',
	});
	if (response.ok) {
		const user = await response.json();
		return user;
	} else {
		const errDetails = await response.text();
		throw errDetails;
	}
};

const logOut = async () => {
	const response = await fetch(SERVER_URL + '/api/sessions/current', {
		method: 'DELETE',
		credentials: 'include',
	});
	if (response.ok) return null;
};

const getCourses = async () => {
	const response = await fetch(SERVER_URL + '/api/courses');
	if (response.ok) {
		const courses = await response.json();
		courses.sort(function (a, b) {
			if (a.name < b.name) return -1;
			if (a.name > b.name) return 1;
			return 0;
		});
		return courses;
	} else {
		const errDetails = await response.text();
		throw errDetails;
	}
};

const getStudyPlan = async (studentCode, studyPlanId) => {
	if (studyPlanId === null) {
		return new StudyPlan();
	}
	const response = await fetch(
		SERVER_URL + `/api/students/${studentCode}/${studyPlanId}`,
		{
			credentials: 'include',
		}
	);
	if (response.ok) {
		const studyPlan = await response.json();
		return studyPlan;
	} else {
		const errDetails = await response.text();
		throw errDetails;
	}
};

const createStudyPlan = async (studentCode, studyPlan) => {
	const response = await fetch(
		SERVER_URL + `/api/students/${studentCode}/studyPlan`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify(studyPlan),
		}
	);
	if (response.ok) {
		const studyPlanId = await response.json();
		return studyPlanId;
	} else {
		const errDetails = await response.text();
		throw errDetails;
	}
};

const editStudyPlan = async (studentCode, studyPlan) => {
	const response = await fetch(
		SERVER_URL + `/api/students/${studentCode}/studyPlan`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify(studyPlan),
		}
	);
	if (response.ok) {
		await response.json();
		return;
	} else {
		const errDetails = await response.text();
		throw errDetails;
	}
};

const deleteStudyPlan = async (studentCode, studyPlanId) => {
	const response = await fetch(
		SERVER_URL + `/api/students/${studentCode}/${studyPlanId}`,
		{
			method: 'DELETE',
			credentials: 'include',
		}
	);
	if (response.ok) {
		return;
	} else {
		const errDetails = await response.text();
		throw errDetails;
	}
};

const API = {
	logIn,
	getUserInfo,
	logOut,
	getCourses,
	getStudyPlan,
	deleteStudyPlan,
	getUserByCode,
	createStudyPlan,
	editStudyPlan,
};
export default API;
