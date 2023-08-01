class Student {
	constructor(id, email, name, surname, studyPlanId = null, password) {
		this.id = id;
		this.email = email;
		this.name = name;
		this.surname = surname;
		this.studyPlanId = studyPlanId;
		this.password = password;
	}

	getStudentFullName() {
		return this.surname + this.name;
	}

	getStudyPlanId() {
		return this.studyPlanId;
	}
}

exports.Student = Student;
