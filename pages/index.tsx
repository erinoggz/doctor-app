import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { GET_QUESTIONS } from '../graphql/queries';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-hot-toast';
import { CREATE_PATIENT } from '../graphql/mutations';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
	const [email, setEmail] = useState<string>('');
	const [patientName, setPatientName] = useState<string>('');
	const [sicknessType, setSicknessType] = useState<string>('');
	const router = useRouter();

	const [createPatient, { data, loading, error }] = useMutation(CREATE_PATIENT);

	useEffect(() => {
		if (data) {
			const { status, message } = data.createPatient;

			if (status === 'error') {
				toast.error(message);
			}
		}
	}, [data, error]);

	const handleSubmit = async () => {
		if (email && patientName && sicknessType) {
			await createPatient({
				variables: {
					patientInput: {
						email,
						patientName,
						sicknessType,
					},
				},
			});

			setEmail('');
			setPatientName('');
			setSicknessType('');

			router.push(`/pending-question?email=${email}`);
		}
	};

	return (
		<div className='flex items-baseline justify-between px-8 pt-8 w-[900px] mx-auto'>
			{/* patientName email sicknessType: ["malaria", "cancer"], document: */}
			<div className='flex items-baseline justify-between px-8 pt-8 w-[900px] mx-auto'>
				<div>
					<h1 className='text-2xl font-bold mb-4'>How can we help you? Please fill the form below</h1>
					<div className='space-y-8'>
						<div>
							<label className='text-sm text-gray-900'>Name</label>
							<input
								className='ml-2 border border-gray-500 px-2'
								type='name'
								placeholder='20'
								required
								value={patientName}
								onChange={e => setPatientName(e.target.value)}
							/>
						</div>
						<div>
							<label className='text-sm text-gray-900'>Email</label>
							<input
								className='ml-2 border border-gray-500 px-2'
								type='email'
								placeholder='20'
								required
								value={email}
								onChange={e => setEmail(e.target.value)}
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
								value={sicknessType}
								onChange={e => setSicknessType(e.target.value)}
							>
								<option disabled selected value=''>
									Select type of sickness
								</option>
								<option value='malaria'>malaria</option>
								<option value='cancer'>cancer</option>
							</select>
						</div>
					</div>
					<button
						onClick={() => handleSubmit()}
						className='bg-black mt-4 rounded-md px-2 flex items-center justify-center text-white py-2 hover:bg-gray-700'
					>
						{loading ? 'Creating Patient...' : 'Submit Questionnaire'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Home;
