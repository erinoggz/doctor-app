import { useMutation, useQuery } from '@apollo/client';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CREATE_QUESTION, EDIT_QUESTION } from '../../graphql/mutations';
import { toast } from 'react-hot-toast';
import { GET_QUESTIONS } from '../../graphql/queries';
import { useRouter } from 'next/router';

const Doctor: NextPage = () => {
	const [allChoices, setAllChoices] = useState<any>([]);
	const [choice, setChoice] = useState<string>('');
	const [questionType, setQuestionType] = useState<string>('');
	const [question, setQuestion] = useState<string>('');
	const [sicknessType, setSicknessType] = useState<string>('');
	const [figure, setFigure] = useState<string>('');
	const [unit, setUnit] = useState<string>('');
	const [currentQuestion, setCurrentQuestion] = useState<any>(null);
	const router = useRouter();

	const {
		data: questionsData,
		loading: questionsLoader,
		error: questionsError,
	} = useQuery(GET_QUESTIONS);

	const [createQuestion, { data, loading, error }] = useMutation(
		CREATE_QUESTION,
		{
			refetchQueries: [
				{
					query: GET_QUESTIONS,
				},
			],
		}
	);

	const [
		editQuestion,
		{ data: editData, loading: editLoader, error: editError },
	] = useMutation(EDIT_QUESTION, {
		refetchQueries: [
			{
				query: GET_QUESTIONS,
			},
		],
	});

	const addChoice = (newChoice: string) => {
		if (newChoice) {
			setAllChoices([...allChoices, newChoice]);
			setChoice('');
		}
	};

	const addQuestion = async () => {
		if (question && sicknessType && figure && unit && questionType) {
			await createQuestion({
				variables: {
					questionInput: {
						choices: allChoices,
						question,
						sicknessType,
						figure,
						unit,
						type: questionType,
					},
				},
			});

			setAllChoices([]);
			setChoice('');
			setQuestionType('');
			setQuestion('');
			setSicknessType('');
			setFigure('');
			setUnit('');
		}
	};

	const updateQuestion = async () => {
		const { question, sicknessType, figure, unit, type, _id } = currentQuestion;

		if (question && sicknessType && figure && unit && type) {
			await editQuestion({
				variables: {
					editQuestionInput: {
						choices: allChoices,
						question,
						sicknessType,
						figure,
						unit,
						type,
						id: _id,
					},
				},
			});

			setCurrentQuestion(null);
			setAllChoices([]);
			setChoice('');
			setQuestionType('');
			setQuestion('');
			setSicknessType('');
			setFigure('');
			setUnit('');
		}
	};

	useEffect(() => {
		if (data) {
			const { status, message } = data.createQuestion;

			if (status === 'success') {
				toast.success(message);
			}

			if (status === 'error') {
				toast.error(message);
			}
		}
	}, [data, error]);

	useEffect(() => {
		if (editData) {
			const { status, message } = editData.editQuestion;

			if (status === 'success') {
				toast.success(message);
			}

			if (status === 'error') {
				toast.error(message);
			}
		}
	}, [editData, editError]);

	useEffect(() => {
		if (questionsData) {
			const { status, message } = questionsData.getQuestions;

			if (status === 'error') {
				toast.error(message);
			}
		}
	}, [questionsData, questionsError]);

	return (
		<div>
			<nav className='bg-black text-white h-[50px] px-20 py-12 flex items-center justify-between'>
				<div onClick={() => router.push('/')} className='cursor-pointer'>
					LOGO
				</div>{' '}
				<div className='space-x-8'>
					<Link
						className='cursor-pointer hover:text-blue-400'
						href='/doctor/questions'
					>
						Questions
					</Link>
					<Link
						className='cursor-pointer hover:text-blue-400'
						href='/doctor/patients'
					>
						Patients
					</Link>
				</div>
			</nav>
			<div className='flex items-baseline justify-between px-8 pt-8 w-[900px] mx-auto'>
				<div>
					<h1 className='text-2xl font-bold mb-4'>Create Question</h1>
					<div className='space-y-8'>
						<div>
							<textarea
								placeholder='Enter Question'
								rows={10}
								cols={30}
								name='question'
								value={currentQuestion?.question || question}
								onChange={e => {
									setQuestion(e.target.value);
									currentQuestion &&
										setCurrentQuestion({
											...currentQuestion,
											question: e.target.value,
										});
								}}
								required
								className='border border-gray-500 p-4 rounded-[4px]'
							/>
						</div>
						<div>
							<label className='text-sm text-gray-900'>
								Select type of sickness
							</label>
							<select
								className='ml-2 border border-gray-500'
								name='sickenessType'
								id=''
								required
								onChange={e => {
									setSicknessType(e.target.value);
									currentQuestion &&
										setCurrentQuestion({
											...currentQuestion,
											sickenessType: e.target.value,
										});
								}}
								value={currentQuestion?.sicknessType}
								defaultValue={''}
							>
								<option value='' disabled>
									Select type of sickness
								</option>
								<option value='malaria'>malaria</option>
								<option value='cancer'>cancer</option>
							</select>
						</div>
						<div>
							<label className='text-sm text-gray-900'>
								Reminder time figure
							</label>
							<input
								className='ml-2 border border-gray-500 px-2'
								type='text'
								required
								placeholder='20'
								value={currentQuestion?.figure}
								onChange={e => {
									setFigure(e.target.value);
									currentQuestion &&
										setCurrentQuestion({
											...currentQuestion,
											figure: e.target.value,
										});
								}}
							/>
						</div>
						<div>
							<label className='text-sm text-gray-900'>
								Reminder time unit
							</label>
							<select
								required
								className='ml-2 border border-gray-500'
								name=''
								id=''
								onChange={e => {
									setUnit(e.target.value);
									currentQuestion &&
										setCurrentQuestion({
											...currentQuestion,
											unit: e.target.value,
										});
								}}
								value={currentQuestion?.unit}
								defaultValue={''}
							>
								<option value='' disabled>
									Select Duration
								</option>
								<option value='mins'>minutes</option>
								<option value='hours'>hours</option>
								<option value='days'>days</option>
							</select>
						</div>
						<div>
							<label>Question Type</label>
							<select
								className='ml-2 border border-gray-500'
								name='questionType'
								id=''
								required
								defaultValue={''}
								onChange={e => {
									setQuestionType(e.target.value);
									currentQuestion &&
										setCurrentQuestion({
											...currentQuestion,
											type: e.target.value,
										});
								}}
								value={currentQuestion?.type}
							>
								<option value='' disabled>
									Select Question Type
								</option>
								<option value='text'>Text</option>
								<option value='multipleChoice'>Multiple Choice</option>
							</select>
						</div>
						{questionType === 'multipleChoice' && (
							<div>
								<div className='flex items-center space-x-4'>
									<label>Add choice</label>
									<input
										className='ml-2 border border-gray-500 px-2'
										type='text'
										placeholder='fever'
										onChange={e => setChoice(e.target.value)}
										value={choice}
									/>
									<button
										onClick={() => addChoice(choice)}
										className='bg-black rounded-md px-2 flex items-center justify-center text-white py-2 hover:bg-gray-700'
									>
										Add New Choice
									</button>
								</div>
								<ul className='list-disc pl-4'>
									{allChoices?.length > 0 &&
										allChoices.map((choice: string, index: number) => (
											<li key={index}>{choice}</li>
										))}
								</ul>
							</div>
						)}
					</div>
					<button
						className={`mt-4 rounded-md px-2 flex items-center justify-center text-white py-2 hover:bg-gray-700 ${
							loading ? 'bg-gray-400' : 'bg-black'
						}`}
						onClick={currentQuestion ? updateQuestion : addQuestion}
					>
						{currentQuestion && editLoader
							? 'Updating Question'
							: currentQuestion
							? 'Edit Question'
							: loading
							? 'Creating Question...'
							: 'Create Question'}
					</button>
				</div>
				<div>
					<h1 className='text-2xl font-bold mb-4'>All Questions</h1>
					{questionsLoader ? (
						<div>Fetching Questions...</div>
					) : (
						<ul className='space-y-4 list-disc'>
							{questionsData?.getQuestions?.data?.length > 0 ? (
								questionsData?.getQuestions?.data?.map(
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
													setCurrentQuestion(question);
												}}
												className='cursor-pointer text-purple-500 underline'
											>
												Edit
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
			</div>
		</div>
	);
};

export default Doctor;
