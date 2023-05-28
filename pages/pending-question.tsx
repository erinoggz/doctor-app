import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import {
	GET_NOTIFICATIONS,
	GET_PENDING_PATIENT_QUESTIONS,
} from '../graphql/queries';
import { useLazyQuery, useMutation } from '@apollo/client';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import useFileUpload from '../useFileUpload';
import { useDropzone } from 'react-dropzone';
import { ANSWER_QUESTION } from '../graphql/mutations';

const PendingQuestion: NextPage = () => {
	const [currentQuestion, setCurrentQuestion] = useState<any>(null);
	const [file, setFile] = useState<any>(null);
	const [singleChoiceAnswer, setSingleChoiceAnswer] = useState('');
	const [multiChoiceAnswer, setMultiChoiceAnswer] = useState('');

	const router = useRouter();
	const { email } = router.query;

	const [answerQuestion, { data, loading, error }] = useMutation(
		ANSWER_QUESTION,
		{
			refetchQueries: [
				{
					query: GET_PENDING_PATIENT_QUESTIONS,
					variables: { email },
				},
			],
		}
	);

	const [{ data: fileUploadData, loading: fileUploadLoading }, uploadImage] =
		useFileUpload();
	const { getRootProps, getInputProps, acceptedFiles, fileRejections } =
		useDropzone({
			maxFiles: 1,
		});

	useEffect(() => {
		if (data) {
			const { status, message } = data.answerQuestion;

			if (status === 'success') {
				toast.success(message);
			}

			if (status === 'error') {
				toast.error(message);
			}
		}
	}, [data, error]);

	useEffect(() => {
		if (fileUploadData) {
			setFile(fileUploadData);
		}
	}, [fileUploadData]);

	useEffect(() => {
		if (acceptedFiles.length > 0) {
			uploadImage(acceptedFiles);
		}
		//eslint-disable-next-line
	}, [acceptedFiles]);

	const [
		getPendingPatientQuestions,
		{ data: questionsData, loading: questionsLoader, error: questionsError },
	] = useLazyQuery(GET_PENDING_PATIENT_QUESTIONS);

	const [getNotifications, { data: notifyData, error: notifyError }] =
		useLazyQuery(GET_NOTIFICATIONS);

	useEffect(() => {
		if (email) {
			getPendingPatientQuestions({
				variables: {
					email,
				},
			});
			getNotifications({
				variables: {
					email,
				},
			});
		}
		//eslint-disable-next-line
	}, [router.query]);

	useEffect(() => {
		if (questionsData) {
			const { status, message } = questionsData.getPendingPatientQuestions;

			if (status === 'error') {
				toast.error(message);
			}
		}
	}, [questionsData, questionsError]);

	useEffect(() => {
		if (notifyData) {
			const { status, message } = notifyData.getNotifications;

			if (status === 'error') {
				toast.error(message);
			}
		}
	}, [notifyData, notifyError]);

	const handleAnswerQuestion = (question: any) => {
		setMultiChoiceAnswer('');
		setSingleChoiceAnswer('');
		setCurrentQuestion(question);
	};

	const handleSubmit = async () => {
		if (!currentQuestion)
			return toast.error('Please select a question you want to answer');
		if (email && currentQuestion) {
			await answerQuestion({
				variables: {
					answerInput: {
						answer: multiChoiceAnswer || singleChoiceAnswer,
						patientEmail: email,
						questionId: currentQuestion?._id,
						file: file?.url,
					},
				},
			});

			setFile('');
			setSingleChoiceAnswer('');
			setMultiChoiceAnswer('');
		} else {
			toast.error('Fill in all fields');
		}
	};

	return (
		<div className='flex items-baseline justify-between px-8 pt-8 w-[900px] mx-auto'>
			<div>
				<h1 className='text-2xl font-bold mb-4'>All Questions</h1>
				{questionsLoader ? (
					<div>Fetching Questions...</div>
				) : (
					<ul className='space-y-4 list-disc'>
						{questionsData?.getPendingPatientQuestions?.data?.length > 0 ? (
							questionsData?.getPendingPatientQuestions?.data?.map(
								(question: any, index: number) => (
									<li
										key={question._id}
										className='space-x-4 flex items-center'
									>
										<span>{index + 1}</span>
										<span className='cursor-pointer capitalize'>
											{question?.question}?
										</span>
										<p
											onClick={() => {
												handleAnswerQuestion(question);
											}}
											className='cursor-pointer text-purple-500 underline'
										>
											Answer Question
										</p>
									</li>
								)
							)
						) : (
							<div>No questions currently</div>
						)}
					</ul>
				)}
			</div>

			{/* patientName email sicknessType: ["malaria", "cancer"], document: */}
			<div className='flex items-baseline justify-between px-8 pt-8 w-[900px] mx-auto'>
				<div>
					<h1 className='text-2xl font-bold mb-4'>
						{currentQuestion
							? `Currently answering ${currentQuestion?.question}?`
							: 'Answer the Questionnaire'}
					</h1>
					<div className='space-y-8'>
						{currentQuestion?.type !== 'multipleChoice' ? (
							<div>
								<label className='text-sm text-gray-900 mr-2'>Answer</label>
								<textarea
									placeholder='Enter Answer'
									rows={5}
									cols={30}
									name='answer'
									value={singleChoiceAnswer}
									onChange={e => setSingleChoiceAnswer(e.target.value)}
									className='border border-gray-500 p-4 rounded-[4px]'
								/>
							</div>
						) : (
							<div>
								{currentQuestion?.choices?.length > 0 &&
									currentQuestion?.choices?.map(
										(choice: string, index: number) => (
											<div key={index}>
												<label className='mr-2'>{choice}</label>
												<input
													name='multiChoiceAnswer'
													type='radio'
													value={choice}
													onChange={e => setMultiChoiceAnswer(e.target.value)}
												/>
											</div>
										)
									)}
							</div>
						)}
						<div>
							<label className='text-sm text-gray-900'>Email</label>
							<input
								className='ml-2 border border-gray-500 px-2'
								type='email'
								required
								disabled
								value={email}
							/>
						</div>
						<div>
							<label className='text-sm text-gray-900'>Document</label>

							<div className='cursor-pointer relative mt-4' {...getRootProps()}>
								<input {...getInputProps()} />
								<input
									required
									className='ml-2 border border-gray-500 px-2 cursor-pointer'
									placeholder={`${
										fileUploadLoading ? 'Uploading...' : 'Click to Upload Image'
									}`}
									disabled
								/>
							</div>
						</div>
					</div>
					<button
						onClick={handleSubmit}
						className='bg-black mt-4 rounded-md px-2 flex items-center justify-center text-white py-2 hover:bg-gray-700'
					>
						{loading ? 'Submitting...' : 'Submit'}
					</button>
                </div>

                <div className='m-10'>
					
                    <h1 className='text-2xl font-bold mb-4'>Notificatons</h1>

					{notifyData?.getNotifications?.data.map((data: any, index: number)=> (
						<div key={index}>
							<ul className='space-y-4 list-disc'>
									<li
										className='space-x-4 mb-5'
									>
										<p
											
											className='text-red-500'
										>
											{data?.body}
										</p>
										<p
											
											className='text-sm text-gray-900'
										>
											{data?.question?.question}
										</p>
									</li>
					</ul>
						</div>
					))}
                </div>
			</div>
		</div>
	);
};

export default PendingQuestion;
