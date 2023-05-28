import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';


const apiGateWayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL_DOMAIN;

const httpLink = createHttpLink({
	uri: apiGateWayUrl,
});

const authLink = setContext((_, { headers }) => {
	// return the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			token: '',
		},
	};
});

const apolloClient = new ApolloClient({
	uri: apiGateWayUrl,
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
	name: 'Doctor App',
	version: '1.0',
});

export default apolloClient;
