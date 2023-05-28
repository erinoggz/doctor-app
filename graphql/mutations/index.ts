import { gql } from '@apollo/client';

const CREATE_QUESTION = gql`
	mutation CreateQuestion($questionInput: QuestionInput!) {
		createQuestion(questionInput: $questionInput) {
			status
			message
		}
	}
`;

const EDIT_QUESTION = gql`
	mutation Mutation($editQuestionInput: EditQuestionInput!) {
		editQuestion(editQuestionInput: $editQuestionInput) {
			status
			message
		}
	}
`;

const ANSWER_QUESTION = gql`
	mutation Mutation($answerInput: AnswerInput!) {
		answerQuestion(answerInput: $answerInput) {
			status
			message
		}
	}
`;

const CREATE_PATIENT = gql`
	mutation Mutation($patientInput: PatientInput!) {
		createPatient(patientInput: $patientInput) {
			status
			message
		}
	}
`;

export { CREATE_QUESTION, EDIT_QUESTION, ANSWER_QUESTION, CREATE_PATIENT };
