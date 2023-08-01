'use strict';

const sqlite = require('sqlite3');
const { Course } = require('./classes/Course');
const { StudyPlan } = require('./classes/StudyPlan');
const crypto = require('crypto');

const db = new sqlite.Database('university.db', (err) => {
	if (err) throw err;
});

// List courses
exports.listCourses = async () => {
	try {
		const courses = await getCourses();
		for (let i = 0; i < courses.length; i++) {
			await getIncompatibleCourses(courses[i]);
			await getEnrolledStudents(courses[i]);
		}
		return courses;
	} catch (err) {
		return;
	}
};

function getCourses() {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM COURSE;';
		db.all(sql, [], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				const courses = rows.map((row) => {
					return new Course(
						row.CODE,
						row.NAME,
						row.DESCRIPTION,
						row.CREDITS,
						[],
						row.PREPARATORY_COURSE_CODE,
						row.MAX_STUDENT_NUMBER,
						[]
					);
				});
				resolve(courses);
			}
		});
	});
}

function getIncompatibleCourses(course) {
	return new Promise((resolve, reject) => {
		const sql =
			'SELECT INCOMPATIBLE_COURSE_CODE FROM INCOMPATIBLE_COURSE WHERE COURSE_CODE = ?;';
		db.all(sql, [course.code], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				rows.map((row) =>
					course.incompatibleCourses.push(row.INCOMPATIBLE_COURSE_CODE)
				);
				resolve('Done');
			}
		});
	});
}

function getEnrolledStudents(course) {
	return new Promise((resolve, reject) => {
		const sql =
			'SELECT STUDENT.CODE, STUDENT.NAME, STUDENT.SURNAME, STUDENT.STUDYPLAN_ID FROM STUDYPLAN_COURSE, STUDENT WHERE STUDYPLAN_COURSE.COURSE_CODE = ? AND STUDYPLAN_COURSE.STUDYPLAN_ID = STUDENT.STUDYPLAN_ID';
		db.all(sql, [course.code], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				rows.map((row) => {
					course.enrolledStudents.push({
						code: row.CODE,
						name: row.NAME,
						surname: row.SURNAME,
					});
				});
				resolve(course);
			}
		});
	});
}

// get student's study plan
exports.getStudyPlan = async (studyPlanId) => {
	if (studyPlanId === null) {
		return new StudyPlan();
	}
	const studyPlan = await findStudyPlan(studyPlanId);
	const coursesCodes = await getStudyPlanCoursesCodes(studyPlan);
	for (let i = 0; i < coursesCodes.length; i++) {
		await getCourseByCode(coursesCodes[i]).then((course) => {
			studyPlan.courses.push(course);
		});
	}
	return studyPlan;
};

function findStudyPlan(studyPlanId) {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM STUDYPLAN WHERE ID = ?;';
		db.get(sql, [studyPlanId], (err, row) => {
			if (err) {
				reject(err);
			} else {
				const studyPlan = new StudyPlan(row.ID, row.TYPE, row.CREDITS, []);
				resolve(studyPlan);
			}
		});
	});
}

function getStudyPlanCoursesCodes(studyPlan) {
	return new Promise((resolve, reject) => {
		const coursesCodes = [];
		const sql =
			'SELECT COURSE_CODE FROM STUDYPLAN_COURSE WHERE STUDYPLAN_ID = ?;';
		db.all(sql, [studyPlan.id], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				rows.forEach((row) => coursesCodes.push(row.COURSE_CODE));
				resolve(coursesCodes);
			}
		});
	});
}

function getCourseByCode(courseCode) {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM COURSE WHERE CODE = ?;';
		db.get(sql, [courseCode], (err, row) => {
			if (err) {
				reject(err);
			} else {
				const course = {
					code: row.CODE,
					name: row.NAME,
					description: row.DESCRIPTION,
					credits: row.CREDITS,
					preparatoryCourse: row.PREPARATORY_COURSE_CODE,
					maxStudentsNumber: row.MAX_STUDENT_NUMBER,
					incompatibleCourses: [],
					enrolledStudents: [],
				};
				getIncompatibleCourses(course).then(() => {
					getEnrolledStudents(course);
				});
				resolve(course);
			}
		});
	});
}

// Verify the user
exports.getUser = (email, password) => {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM STUDENT WHERE EMAIL=?';
		db.get(sql, [email], (err, row) => {
			if (err) {
				reject(err);
			} else if (row === undefined) {
				resolve(false);
			} else {
				const user = {
					username: row.EMAIL,
					code: row.CODE,
					name: row.NAME,
					surname: row.SURNAME,
					studyPlanId: row.STUDYPLAN_ID,
				};
				crypto.scrypt(password, row.SALT, 64, function (err, hasedPassword) {
					if (err) reject(err);
					if (
						crypto.timingSafeEqual(
							Buffer.from(row.PASSWORD, 'hex'),
							hasedPassword
						)
					) {
						resolve(user);
					} else {
						resolve(false);
					}
				});
			}
		});
	});
};

// get user by code
exports.getUserbyCode = (code) => {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM STUDENT WHERE CODE = ?;';
		db.get(sql, [code], (err, row) => {
			if (err) {
				reject(err);
			} else {
				resolve({
					code: row.CODE,
					email: row.EMAIL,
					name: row.NAME,
					surname: row.SURNAME,
					studyPlanId: row.STUDYPLAN_ID,
				});
			}
		});
	});
};

exports.createStudyPlan = (studyPlan) => {
	return new Promise((resolve, reject) => {
		let studyPlanId;
		const sql = 'INSERT INTO STUDYPLAN (TYPE, CREDITS) VALUES (? , ?);';
		const sql2 = 'UPDATE STUDENT SET STUDYPLAN_ID = ? WHERE CODE = ?;';
		const sql3 =
			'INSERT INTO STUDYPLAN_COURSE (COURSE_CODE, STUDYPLAN_ID) VALUES (? , ?);';
		db.run(sql, [studyPlan.type, studyPlan.credits], function (err) {
			if (err) {
				reject(err);
			} else {
				studyPlanId = this.lastID;
				db.run(sql2, [studyPlanId, studyPlan.studentCode], function (err) {
					if (err) {
						reject(err);
					} else {
						studyPlan.courses.forEach((course) => {
							db.run(sql3, [course.code, studyPlanId], function (err) {
								if (err) {
									reject(err);
								}
							});
						});
					}
				});
				resolve(studyPlanId);
			}
		});
	});
};

//update a study plan
exports.editStudyPlan = (studyPlan) => {
	return new Promise((resolve, reject) => {
		const sql = 'UPDATE STUDYPLAN SET TYPE = ? , CREDITS = ? WHERE ID = ?;';
		const sql2 = 'DELETE FROM STUDYPLAN_COURSE WHERE STUDYPLAN_ID = ?;';
		const sql3 =
			'INSERT INTO STUDYPLAN_COURSE (COURSE_CODE, STUDYPLAN_ID) VALUES (? , ?);';
		db.run(
			sql,
			[studyPlan.type, studyPlan.credits, studyPlan.id],
			function (err) {
				if (err) {
					reject(err);
				} else {
					db.run(sql2, [studyPlan.id], function (err) {
						if (err) {
							reject(err);
						} else {
							studyPlan.courses.forEach((course) => {
								db.run(sql3, [course.code, studyPlan.id], function (err) {
									if (err) {
										reject(err);
									} else {
										resolve(this.changes);
									}
								});
							});
						}
					});
				}
			}
		);
	});
};

exports.deleteStudyPlan = (studentCode, studyPlanId) => {
	return new Promise((resolve, reject) => {
		const sql = 'DELETE FROM STUDYPLAN_COURSE WHERE STUDYPLAN_ID = ?;';
		const sql2 = 'DELETE FROM STUDYPLAN WHERE ID = ?;';
		const sql3 = 'UPDATE STUDENT SET STUDYPLAN_ID = null WHERE CODE = ?;';
		db.run(sql, [studyPlanId], function (err) {
			if (err) {
				reject(err);
			} else {
				db.run(sql2, [studyPlanId], function (err) {
					if (err) {
						reject(err);
					} else {
						db.run(sql3, [studentCode], function (err) {
							if (err) {
								reject(err);
							}
						});
					}
				});
				resolve(this.changes);
			}
		});
	});
};
