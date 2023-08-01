'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const DAO = require('./DAO');

/* init express */
const app = new express();
const port = 3001;

/*  set up the middlewares */

app.use(morgan('dev'));
app.use(express.json());

//setup and enable Cors
const corsOptions = {
	origin: 'http://localhost:3000',
	optionsSuccessStatus: 200,
	credentials: true,
};
app.use(cors(corsOptions));

// Passport: setup the local strategy
passport.use(
	new LocalStrategy(async function verify(username, password, cb) {
		const user = await DAO.getUser(username, password);
		if (!user) {
			return cb(null, false, 'Incorrect username or password.');
		} else {
			return cb(null, user);
		}
	})
);

passport.serializeUser(function (user, cb) {
	cb(null, user);
});

passport.deserializeUser(function (user, cb) {
	return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	return res.status(401).json('401 Not authorized');
};

// Setup the session
app.use(
	session({
		secret: 'secret is a secret',
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.authenticate('session'));

/*** APIs ***/
// List all courses
app.get('/api/courses', (req, res) => {
	DAO.listCourses()
		.then((courses) => {
			return res.status(200).json(courses);
		})
		.catch((err) => {
			return res.status(500).json(err);
		});
});

// get student's study plan
app.get(
	'/api/students/:studentCode/:studyPlanId',
	isLoggedIn,
	async (req, res) => {
		try {
			const studyPlan = await DAO.getStudyPlan(req.params.studyPlanId);
			return res.status(200).json(studyPlan);
		} catch (err) {
			return res.status(500).json(err);
		}
	}
);

//create a study plan
app.post(
	'/api/students/:studentCode/studyPlan',
	isLoggedIn,
	async (req, res) => {
		const studyPlan = {
			studentCode: req.params.studentCode,
			type: req.body.type,
			credits: req.body.credits,
			courses: req.body.courses,
		};
		try {
			const studyPlanId = await DAO.createStudyPlan(studyPlan);
			return res.status(201).json(studyPlanId);
		} catch (err) {
			return res.status(500).json(err);
		}
	}
);

//Update a study plan
app.put(
	'/api/students/:studentCode/studyPlan',
	isLoggedIn,
	async (req, res) => {
		const newStudyPlan = {
			id: req.body.id,
			studentCode: req.params.studentCode,
			type: req.body.type,
			credits: req.body.credits,
			courses: req.body.courses,
		};
		try {
			await DAO.editStudyPlan(newStudyPlan);
			return res.status(200).end();
		} catch (err) {
			return res.status(500).json(err);
		}
	}
);

//Delete a study plan
app.delete(
	'/api/students/:studentCode/:studyPlanId',
	isLoggedIn,
	async (req, res) => {
		try {
			await DAO.deleteStudyPlan(req.params.studentCode, req.params.studyPlanId);
			return res.status(204).end();
		} catch (err) {
			return res.status(500).json(err);
		}
	}
);

/* User APIs */

//POST /api/sessions
app.post('/api/sessions', passport.authenticate('local'), (req, res) => {
	res.status(201).json(req.user);
});

// GET /api/sessions/current
app.get('/api/sessions/current', (req, res) => {
	if (req.isAuthenticated()) {
		res.json(req.user);
	} else res.status(401).end();
});

// DELETE /api/session/current
app.delete('/api/sessions/current', (req, res) => {
	req.logout(() => {
		res.end();
	});
});

// get student by code
app.get('/api/students/:studentCode', isLoggedIn, async (req, res) => {
	try {
		const user = await DAO.getUserbyCode(req.params.studentCode);
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

// activate the server
app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
