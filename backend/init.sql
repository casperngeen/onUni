CREATE TYPE validUsers AS ENUM('student', 'teacher');
CREATE TYPE testTypes AS ENUM('quiz', 'practice', 'exam');
CREATE TYPE scoringFormats AS ENUM('highest', 'average');
CREATE TYPE statusTypes AS ENUM('submitted', 'in-progress')

DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    userId SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    profilePic BYTEA,
    role validUsers DEFAULT 'student'
);

DROP TABLE IF EXISTS Courses;

CREATE TABLE Courses(
    courseId SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    startDate DATE DEFAULT CURRENT_DATE,
    endDate DATE DEFAULT CURRENT_DATE
);

DROP TABLE IF EXISTS Enrollments;

CREATE TABLE Enrollments(
    enrollmentId SERIAL PRIMARY KEY,
    userId INTEGER REFERENCES Users(userId),
    courseId INTEGER REFERENCES Courses(courseId)
);

DROP TABLE IF EXISTS Tests;

CREATE TABLE Tests(
    testId SERIAL PRIMARY KEY,
    courseId INTEGER REFERENCES Courses(courseId),
    testType testTypes NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    attemptsAllowed INTEGER,
    deadline TIMESTAMP,
    scoringFormat scoringFormats,
    currentScore NUMERIC(10, 3),
    maximumScore INTEGER NOT NULL
);

DROP TABLE IF EXISTS Questions;

CREATE TABLE Questions(
    questionId SERIAL PRIMARY KEY,
    testId INTEGER REFERENCES Tests(testId),
    questionText TEXT NOT NULL
);

DROP TABLE IF EXISTS Options;

CREATE TABLE Options(
    optionId SERIAL PRIMARY KEY,
    questionId INTEGER REFERENCES Questions(questionId),
    optionText TEXT NOT NULL,
    isCorrect BOOLEAN NOT NULL
);

DROP TABLE IF EXISTS Attempts;

CREATE TABLE Attempts(
    attemptId SERIAL PRIMARY KEY,
    testId INTEGER REFERENCES Tests(testId),
    status statusTypes DEFAULT 'in-progress',
    attemptNumber INTEGER NOT NULL,
    attemptScore NUMERIC(10, 3),
    timeSubmitted TIMESTAMP
);

DROP TABLE IF EXISTS QuestionAttempts;

CREATE TABLE QuestionAttempts(
    questionAttemptId SERIAL PRIMARY KEY,
    attemptId INTEGER REFERENCES Attempts(attemptId),
    questionId INTEGER REFERENCES Questions(questionId),
    selectedOptionId INTEGER REFERENCES Options(optionId)
);