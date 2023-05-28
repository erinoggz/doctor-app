import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '../apollo';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ApolloProvider client={apolloClient}>
			<Component {...pageProps} />
			<Toaster position='top-center' reverseOrder={false} />
		</ApolloProvider>
	);
}

export default MyApp;
