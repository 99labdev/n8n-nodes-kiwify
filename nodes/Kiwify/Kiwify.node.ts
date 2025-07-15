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
		description: 'Interagir com a API da Kiwify',
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
				displayName: 'Operação',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Obter Detalhes Da Conta',
						value: 'getAccountDetails',
						description: 'Obter detalhes da conta Kiwify',
						action: 'Obter detalhes da conta',
					},
					{
						name: 'Listar Produtos',
						value: 'listProducts',
						description: 'Obter uma lista de todos os produtos',
						action: 'Listar produtos',
					},
					{
						name: 'Consultar Produto',
						value: 'getProduct',
						description: 'Obter detalhes de um produto específico',
						action: 'Consultar produto',
					},
				],
				default: 'getAccountDetails',
			},
			{
				displayName: 'ID Do Produto',
				name: 'productId',
				type: 'string',
				required: true,
				default: '',
				description: 'ID do produto a ser consultado',
				displayOptions: {
					show: {
						operation: ['getProduct'],
					},
				},
			},
			{
				displayName: 'Tamanho Da Página',
				name: 'pageSize',
				type: 'number',
				default: 10,
				description: 'Número de produtos a retornar por página',
				displayOptions: {
					show: {
						operation: ['listProducts'],
					},
				},
			},
			{
				displayName: 'Número Da Página',
				name: 'pageNumber',
				type: 'number',
				default: 1,
				description: 'Número da página a recuperar',
				displayOptions: {
					show: {
						operation: ['listProducts'],
					},
				},
			},
		],
	};

	// A função abaixo é responsável por executar o que este node
	// deve fazer. Neste caso, estamos implementando operações da API da Kiwify.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Obter credenciais
		const credentials = await this.getCredentials('kiwifyApi');

		// Obter token de acesso
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
					// Fazer requisição à API para obter detalhes da conta
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
				} else if (operation === 'listProducts') {
					// Obter parâmetros para listar produtos
					const pageSize = this.getNodeParameter('pageSize', i) as number;
					const pageNumber = this.getNodeParameter('pageNumber', i) as number;

					// Construir parâmetros de consulta
					const queryParams: string[] = [];
					if (pageSize) {
						queryParams.push(`page_size=${pageSize}`);
					}
					if (pageNumber) {
						queryParams.push(`page_number=${pageNumber}`);
					}

					// Fazer requisição à API para listar produtos
					const options = {
						method: 'GET' as const,
						url: `https://public-api.kiwify.com/v1/products${queryParams.length ? '?' + queryParams.join('&') : ''}`,
						headers: {
							'Authorization': `Bearer ${accessToken}`,
							'x-kiwify-account-id': credentials.accountId as string,
						},
						json: true,
					};

					responseData = await this.helpers.request(options);
				} else if (operation === 'getProduct') {
					// Obter parâmetro do ID do produto
					const productId = this.getNodeParameter('productId', i) as string;

					// Fazer requisição à API para consultar produto específico
					const options = {
						method: 'GET' as const,
						url: `https://public-api.kiwify.com/v1/products/${productId}`,
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
