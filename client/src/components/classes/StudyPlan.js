class StudyPlan {
	constructor(id = null, type = '', credits = 0, courses = []) {
		this.id = id;
		this.type = type;
		this.credits = credits;
		this.courses = courses;
	}

	getType() {
		return this.type;
	}

	getCourses() {
		return this.courses;
	}

	getStudentCode() {
		return this.studentCode;
	}
}

exports.StudyPlan = StudyPlan;
