import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class Kiwify implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Kiwify',
		name: 'kiwify',
		icon: 'file:kiwify-seeklogo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with Kiwify API',
		defaults: {
			name: 'Kiwify',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'kiwifyApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get Account Details',
						value: 'getAccountDetails',
						description: 'Get details of the Kiwify account',
						action: 'Get account details',
					},
				],
				default: 'getAccountDetails',
			},
		],
	};

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're implementing Kiwify API operations.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Get credentials
		const credentials = await this.getCredentials('kiwifyApi');

		// Get access token
		const tokenOptions = {
			method: 'POST' as const,
			url: 'https://public-api.kiwify.com/v1/oauth/token',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			form: {
				client_id: credentials.clientId,
				client_secret: credentials.clientSecret,
			},
			json: true,
		};

		const tokenResponse = await this.helpers.request(tokenOptions);
		const accessToken = tokenResponse.access_token;

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;

				let responseData;

				if (operation === 'getAccountDetails') {
					// Make API request to get account details
					const options = {
						method: 'GET' as const,
						url: 'https://public-api.kiwify.com/v1/account-details',
						headers: {
							'Authorization': `Bearer ${accessToken}`,
							'x-kiwify-account-id': credentials.accountId as string,
						},
						json: true,
					};

					responseData = await this.helpers.request(options);
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const errorData = this.helpers.constructExecutionMetaData(
						[{ json: { error: error.message } }],
						{ itemData: { item: i } },
					);
					returnData.push(...errorData);
					continue;
				}
				throw new NodeOperationError(this.getNode(), error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}
