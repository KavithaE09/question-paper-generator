// Type definitions converted to JSDoc comments for JavaScript

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 */

/**
 * @typedef {Object} Department
 * @property {string} id
 * @property {string} name
 * @property {string} code
 */

/**
 * @typedef {Object} Course
 * @property {string} id
 * @property {string} name
 * @property {string} code
 * @property {string} departmentId
 */

/**
 * @typedef {Object} QuestionPaperDetails
 * @property {string} academicYear
 * @property {string} semester
 * @property {string} year
 * @property {string} regulation
 * @property {string} examType
 * @property {string} examDate
 * @property {string} department
 * @property {string} courseCode
 * @property {string} courseName
 * @property {string} [registerNumber]
 */

/**
 * @typedef {Object} Question
 * @property {string} topic
 * @property {string} text
 * @property {string} id
 * @property {number} unit
 * @property {number} marks
 * @property {string} questionText
 * @property {string} bloom
 * @property {string} courseOutcome
 * @property {string} programOutcome
 * @property {boolean} [diagram]
 * @property {string} [imageUrl]
 * @property {number|null} [topicId]
 * @property {string|null} [topicName]
 */

/**
 * @typedef {Object} SubQuestion
 * @property {string} id
 * @property {number} marks
 * @property {string} questionText
 * @property {string} bloom
 * @property {string} courseOutcome
 * @property {string} programOutcome
 * @property {number} unit
 */

/**
 * @typedef {Object} TemplateQuestion
 * @property {any} topic
 * @property {any} diagram
 * @property {import('react').ReactNode} unit
 * @property {string|undefined} imageUrl
 * @property {string} type
 * @property {import('react').ReactNode} bloom
 * @property {import('react').ReactNode} courseOutcome
 * @property {import('react').ReactNode} questionText
 * @property {import('react').ReactNode} programOutcome
 * @property {number} marks
 * @property {string} id
 * @property {string} questionNumber
 * @property {'A'|'B'|'C'} part
 * @property {number} totalMarks
 * @property {Question} [optionA] - For simple and or types
 * @property {Question} [optionB] - For simple and or types
 * @property {SubQuestion[]} [optionA_subQuestions] - For split-or type
 * @property {SubQuestion[]} [optionB_subQuestions] - For split-or type
 */

// Export empty objects to allow importing these as named exports
export const User = {};
export const Department = {};
export const Course = {};
export const QuestionPaperDetails = {};
export const Question = {};
export const SubQuestion = {};
export const TemplateQuestion = {};