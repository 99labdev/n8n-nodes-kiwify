import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class KiwifyApi implements ICredentialType {
	name = 'kiwifyApi';
	displayName = 'Kiwify API';
	documentationUrl = 'https://docs.kiwify.com.br/api-reference/general';
	properties: INodeProperties[] = [
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Kiwify Client ID from API dashboard',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
			required: true,
			description: 'Your Kiwify Client Secret from API dashboard',
		},
		{
			displayName: 'Account ID',
			name: 'accountId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Kiwify Account ID (x-kiwify-account-id header)',
		},
	];

	// This will be implemented in the node itself for OAuth flow
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	// Test the credentials by trying to get an access token
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://public-api.kiwify.com/v1',
			url: '/oauth/token',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: {
				client_id: '={{$credentials.clientId}}',
				client_secret: '={{$credentials.clientSecret}}',
			},
		},
	};
}
