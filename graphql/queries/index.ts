import { gql } from '@apollo/client';

const GET_QUESTIONS = gql`
	query GetQuestions {
		getQuestions {
			message
			data {
				_id
				question
				sicknessType
				figure
				unit
				type
				choices
				createdAt
				updatedAt
			}
			status
		}
	}
`;

const GET_PENDING_PATIENT_QUESTIONS = gql`
	query Query($email: String!) {
		getPendingPatientQuestions(email: $email)
	}
`;

const GET_PATIENTS = gql`
	query Query {
		getPatients
	}
`;

const GET_PATIENTS_ANSWERS = gql`
	query Query($patientEmail: String!) {
		getPatientAnswers(patientEmail: $patientEmail)
	}
`;

const GET_NOTIFICATIONS = gql`
	query Query($email: String!) {
		getNotifications(email: $email) {
			status
			data {
				_id
				recipient
				body
				title
				read
				question {
					_id
					question
					sicknessType
					figure
					unit
					type
					choices
					createdAt
					updatedAt
				}
			}
			message
		}
	}
`;

export {
	GET_QUESTIONS,
	GET_PATIENTS,
	GET_PATIENTS_ANSWERS,
	GET_PENDING_PATIENT_QUESTIONS,
	GET_NOTIFICATIONS,
};
