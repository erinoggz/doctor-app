import { useLazyQuery, useQuery } from '@apollo/client';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GET_PATIENTS, GET_PATIENTS_ANSWERS } from '../../graphql/queries';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';

const Patients: NextPage = () => {
	const { data, loading, error } = useQuery(GET_PATIENTS);
	const [
		getPatientsAnswers,
		{
			data: getPatientsData,
			loading: getPatientsLoader,
			error: getPatientsError,
		},
	] = useLazyQuery(GET_PATIENTS_ANSWERS);
	const [activeEmail, setActiveEmail] = useState<string>('');

	const router = useRouter();
	const [showQuestion, setShowQuestion] = useState<boolean>(false);

	useEffect(() => {
		if (data) {
			const { status, message } = data.getPatients;

			if (status === 'error') {
				toast.error(message);
			}
		}
	}, [data, error]);

	useEffect(() => {
		if (getPatientsData) {
			const { status, message } = getPatientsData.getPatientAnswers;

			if (status === 'error') {
				toast.error(message);
			}
		}
	}, [getPatientsData, getPatientsError]);

	const handleViewQuestions = async (email: string, id: string) => {
		setActiveEmail(id);
		setShowQuestion(true);
		await getPatientsAnswers({
			variables: {
				patientEmail: email,
			},
		});
	};

	return (
		<div>
			<nav className='bg-black text-white h-[50px] px-20 py-12 flex items-center justify-between'>
				<div onClick={() => router.push('/')} className='cursor-pointer'>
					LOGO
				</div>
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
					<h1 className='text-2xl font-bold mb-4'>All Patients</h1>
					{loading ? (
						<div>Fetching Patients...</div>
					) : (
						<ul className='space-y-4 list-disc'>
							{data?.getPatients?.data?.length > 0 ? (
								data?.getPatients?.data?.map((patient: any, index: number) => (
									<div key={index}>
										<li
											key={patient._id}
											className='space-x-4 flex items-center'
										>
											<span>{index + 1}</span>
											<span className='cursor-pointer capitalize'>
												{patient?.patientName}?
											</span>
											<span
												onClick={() =>
													handleViewQuestions(patient?.email, patient?._id)
												}
												className='text-blue-500 cursor-pointer'
											>
												View Questions
											</span>
										</li>
										{showQuestion &&
											!getPatientsLoader &&
											activeEmail === patient?._id && (
												<div className='block mt-4'>
													<h1 className='text-xl font-bold mb-2'>
														Questions for {patient?.email}
													</h1>
													<ul>
														{getPatientsData?.getPatientAnswers?.data?.length >
														0 ? (
															getPatientsData?.getPatientAnswers?.data.map(
																(data: any, index: number) => (
																	<div className='mb-2' key={data?._id}>
																		<div>
																			<span>{index + 1}</span>.{' '}
																			<span className='text-md font-bold'>
																				Question:
																			</span>{' '}
																			{data?.question?.question}
																		</div>
																		<p>
																			<span className='text-sm font-bold'>
																				Answer:
																			</span>
																			{data?.answer}
																		</p>
																		{data?.file && (
																			<p>
																				<span className='text-sm font-bold'>
																					Document:
																				</span>
																				<a
																					className='underline ml-2 text-purple-500'
																					href={data?.file}
																					target='_blank'
																				>
																					{data?.file}
																				</a>
																			</p>
																		)}
																	</div>
																)
															)
														) : (
															<div>No questions yet...</div>
														)}
													</ul>
													<hr className='my-4' />
												</div>
											)}
									</div>
								))
							) : (
								<div>No patients currently</div>
							)}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
};

export default Patients;

// {
//     "_id": "6472580a2d8f723e83b7d099",
//     "email": "erin.deji@gmail.com",
//     "__v": 0,
//     "answeredAllQuestions": false,
//     "answeredQuestions": [],
//     "createdAt": "2023-05-27T19:20:42.481Z",
//     "patientName": "erin deji",
//     "sicknessType": "malaria",
//     "updatedAt": "2023-05-27T20:31:43.048Z"
// }
