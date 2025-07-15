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
			displayName: 'Bearer Token',
			name: 'bearerToken',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
			description: 'The OAuth Bearer token for Kiwify API authentication',
		},
		{
			displayName: 'Account ID',
			name: 'accountId',
			type: 'string',
			default: '',
			description: 'Your Kiwify Account ID (x-kiwify-account-id header)',
		},
	];

	// This allows the credential to be used by other parts of n8n
	// stating how this credential is injected as part of the request
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Authorization': '={{"Bearer " + $credentials.bearerToken}}',
				'x-kiwify-account-id': '={{$credentials.accountId}}',
			},
		},
	};

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://public-api.kiwify.com/v1',
			url: '/account-details',
			method: 'GET',
		},
	};
}
