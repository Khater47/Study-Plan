class Course {
	constructor(
		code,
		name,
		description,
		credits,
		incompatibleCourses = [],
		preparatoryCourse = null,
		maxStudentsNumber = null,
		enrolledStudents = []
	) {
		this.code = code;
		this.name = name;
		this.description = description;
		this.credits = credits;
		this.incompatibleCourses = incompatibleCourses;
		this.preparatoryCourse = preparatoryCourse;
		this.maxStudentsNumber = maxStudentsNumber;
		this.enrolledStudents = enrolledStudents;
	}
}

exports.Course = Course;
