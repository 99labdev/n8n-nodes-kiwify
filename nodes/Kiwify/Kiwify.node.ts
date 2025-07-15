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
						name: 'Consultar Estatísticas De Vendas',
						value: 'getSalesStats',
						description: 'Obter estatísticas de vendas',
						action: 'Consultar estat sticas de vendas',
					},
					{
						name: 'Consultar Produto',
						value: 'getProduct',
						description: 'Obter detalhes de um produto específico',
						action: 'Consultar produto',
					},
					{
						name: 'Consultar Saldo Específico',
						value: 'getSpecificBalance',
						description: 'Obter saldo específico por legal entity ID',
						action: 'Consultar saldo espec fico',
					},
					{
						name: 'Consultar Saldos',
						value: 'getBalance',
						description: 'Obter todos os saldos da conta',
						action: 'Consultar saldos',
					},
					{
						name: 'Consultar Venda',
						value: 'getSale',
						description: 'Obter detalhes de uma venda específica',
						action: 'Consultar venda',
					},
					{
						name: 'Listar Produtos',
						value: 'listProducts',
						description: 'Obter uma lista de todos os produtos',
						action: 'Listar produtos',
					},
					{
						name: 'Listar Vendas',
						value: 'listSales',
						description: 'Obter uma lista de todas as vendas',
						action: 'Listar vendas',
					},
					{
						name: 'Obter Detalhes Da Conta',
						value: 'getAccountDetails',
						description: 'Obter detalhes da conta Kiwify',
						action: 'Obter detalhes da conta',
					},
					{
						name: 'Reembolsar Venda',
						value: 'refundSale',
						description: 'Reembolsar uma venda específica',
						action: 'Reembolsar venda',
					},
				],
				default: 'getAccountDetails',
			},
			// Parâmetros para Consultar Venda e Reembolsar Venda
			{
				displayName: 'ID Da Venda',
				name: 'saleId',
				type: 'string',
				required: true,
				default: '',
				description: 'ID da venda a ser consultada ou reembolsada',
				displayOptions: {
					show: {
						operation: ['getSale', 'refundSale'],
					},
				},
			},
			// Parâmetros para Reembolsar Venda
			{
				displayName: 'Chave PIX',
				name: 'pixKey',
				type: 'string',
				default: '',
				description: 'Chave PIX para reembolso (opcional)',
				displayOptions: {
					show: {
						operation: ['refundSale'],
					},
				},
			},
			// Parâmetro para Consultar Saldo Específico
			{
				displayName: 'Legal Entity ID',
				name: 'legalEntityId',
				type: 'string',
				required: true,
				default: '',
				description: 'ID da entidade legal para consultar saldo específico',
				displayOptions: {
					show: {
						operation: ['getSpecificBalance'],
					},
				},
			},
			// Parâmetros para Listar Vendas
			{
				displayName: 'Data De Início',
				name: 'startDate',
				type: 'string',
				required: true,
				default: '',
				description: 'Data de início para buscar vendas (formato: YYYY-MM-DD)',
				displayOptions: {
					show: {
						operation: ['listSales'],
					},
				},
			},
			{
				displayName: 'Data De Fim',
				name: 'endDate',
				type: 'string',
				required: true,
				default: '',
				description: 'Data de fim para buscar vendas (formato: YYYY-MM-DD)',
				displayOptions: {
					show: {
						operation: ['listSales'],
					},
				},
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: '',
				description: 'Filtrar vendas por status',
				options: [
					{ name: 'Aguardando Pagamento', value: 'waiting_payment' },
					{ name: 'Aprovado', value: 'approved' },
					{ name: 'Autorizado', value: 'authorized' },
					{ name: 'Estornado', value: 'chargedback' },
					{ name: 'Pago', value: 'paid' },
					{ name: 'Pendente', value: 'pending' },
					{ name: 'Processando', value: 'processing' },
					{ name: 'Recusado', value: 'refused' },
					{ name: 'Reembolsado', value: 'refunded' },
					{ name: 'Reembolso Pendente', value: 'pending_refund' },
					{ name: 'Reembolso Solicitado', value: 'refund_requested' },
					{ name: 'Todos', value: '' },
				],
				displayOptions: {
					show: {
						operation: ['listSales'],
					},
				},
			},
			{
				displayName: 'Método De Pagamento',
				name: 'paymentMethod',
				type: 'options',
				default: '',
				description: 'Filtrar vendas por método de pagamento',
				options: [
					{ name: 'Todos', value: '' },
					{ name: 'Boleto', value: 'boleto' },
					{ name: 'Cartão De Crédito', value: 'credit_card' },
					{ name: 'PIX', value: 'pix' },
				],
				displayOptions: {
					show: {
						operation: ['listSales'],
					},
				},
			},
			{
				displayName: 'ID Do Produto',
				name: 'productIdFilter',
				type: 'string',
				default: '',
				description: 'Filtrar vendas por ID do produto (opcional)',
				displayOptions: {
					show: {
						operation: ['listSales'],
					},
				},
			},
			{
				displayName: 'Detalhes Completos Da Venda',
				name: 'viewFullSaleDetails',
				type: 'boolean',
				default: false,
				description: 'Whether to return full sale details',
				displayOptions: {
					show: {
						operation: ['listSales'],
					},
				},
			},
			// Parâmetros para Consultar Estatísticas
			{
				displayName: 'ID Do Produto',
				name: 'productIdStats',
				type: 'string',
				default: '',
				description: 'ID do produto para estatísticas específicas (opcional)',
				displayOptions: {
					show: {
						operation: ['getSalesStats'],
					},
				},
			},
			{
				displayName: 'Data De Início',
				name: 'startDateStats',
				type: 'string',
				required: true,
				default: '',
				description: 'Data de início para estatísticas (formato: YYYY-MM-DD)',
				displayOptions: {
					show: {
						operation: ['getSalesStats'],
					},
				},
			},
			{
				displayName: 'Data De Fim',
				name: 'endDateStats',
				type: 'string',
				required: true,
				default: '',
				description: 'Data de fim para estatísticas (formato: YYYY-MM-DD)',
				displayOptions: {
					show: {
						operation: ['getSalesStats'],
					},
				},
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
				} else if (operation === 'listSales') {
					// Obter parâmetros para listar vendas
					const startDate = this.getNodeParameter('startDate', i) as string;
					const endDate = this.getNodeParameter('endDate', i) as string;
					const status = this.getNodeParameter('status', i) as string;
					const paymentMethod = this.getNodeParameter('paymentMethod', i) as string;
					const productIdFilter = this.getNodeParameter('productIdFilter', i) as string;
					const viewFullSaleDetails = this.getNodeParameter('viewFullSaleDetails', i) as boolean;
					const pageSize = this.getNodeParameter('pageSize', i) as number;
					const pageNumber = this.getNodeParameter('pageNumber', i) as number;

					// Construir parâmetros de consulta
					const queryParams: string[] = [];
					queryParams.push(`start_date=${startDate}`);
					queryParams.push(`end_date=${endDate}`);
					if (status) queryParams.push(`status=${status}`);
					if (paymentMethod) queryParams.push(`payment_method=${paymentMethod}`);
					if (productIdFilter) queryParams.push(`product_id=${productIdFilter}`);
					if (viewFullSaleDetails) queryParams.push(`view_full_sale_details=${viewFullSaleDetails}`);
					if (pageSize) queryParams.push(`page_size=${pageSize}`);
					if (pageNumber) queryParams.push(`page_number=${pageNumber}`);

					// Fazer requisição à API para listar vendas
					const options = {
						method: 'GET' as const,
						url: `https://public-api.kiwify.com/v1/sales?${queryParams.join('&')}`,
						headers: {
							'Authorization': `Bearer ${accessToken}`,
							'x-kiwify-account-id': credentials.accountId as string,
						},
						json: true,
					};

					responseData = await this.helpers.request(options);
				} else if (operation === 'getSale') {
					// Obter parâmetro do ID da venda
					const saleId = this.getNodeParameter('saleId', i) as string;

					// Fazer requisição à API para consultar venda específica
					const options = {
						method: 'GET' as const,
						url: `https://public-api.kiwify.com/v1/sales/${saleId}`,
						headers: {
							'Authorization': `Bearer ${accessToken}`,
							'x-kiwify-account-id': credentials.accountId as string,
						},
						json: true,
					};

					responseData = await this.helpers.request(options);
				} else if (operation === 'refundSale') {
					// Obter parâmetros para reembolso
					const saleId = this.getNodeParameter('saleId', i) as string;
					const pixKey = this.getNodeParameter('pixKey', i) as string;

					// Construir body da requisição
					const body: any = {};
					if (pixKey) {
						body.pixKey = pixKey;
					}

					// Fazer requisição à API para reembolsar venda
					const options = {
						method: 'POST' as const,
						url: `https://public-api.kiwify.com/v1/sales/${saleId}/refund`,
						headers: {
							'Authorization': `Bearer ${accessToken}`,
							'x-kiwify-account-id': credentials.accountId as string,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(body),
						json: true,
					};

					responseData = await this.helpers.request(options);
				} else if (operation === 'getSalesStats') {
					// Obter parâmetros para estatísticas
					const productIdStats = this.getNodeParameter('productIdStats', i) as string;
					const startDateStats = this.getNodeParameter('startDateStats', i) as string;
					const endDateStats = this.getNodeParameter('endDateStats', i) as string;

					// Construir parâmetros de consulta (start_date e end_date são obrigatórios)
					const queryParams: string[] = [];
					queryParams.push(`start_date=${startDateStats}`);
					queryParams.push(`end_date=${endDateStats}`);
					if (productIdStats) queryParams.push(`product_id=${productIdStats}`);

					// Fazer requisição à API para obter estatísticas
					const options = {
						method: 'GET' as const,
						url: `https://public-api.kiwify.com/v1/stats?${queryParams.join('&')}`,
						headers: {
							'Authorization': `Bearer ${accessToken}`,
							'x-kiwify-account-id': credentials.accountId as string,
						},
						json: true,
					};

					responseData = await this.helpers.request(options);
				} else if (operation === 'getBalance') {
					// Fazer requisição à API para obter todos os saldos
					const options = {
						method: 'GET' as const,
						url: 'https://public-api.kiwify.com/v1/balance',
						headers: {
							'Authorization': `Bearer ${accessToken}`,
							'x-kiwify-account-id': credentials.accountId as string,
						},
						json: true,
					};

					responseData = await this.helpers.request(options);
				} else if (operation === 'getSpecificBalance') {
					// Obter parâmetro do Legal Entity ID
					const legalEntityId = this.getNodeParameter('legalEntityId', i) as string;

					// Fazer requisição à API para obter saldo específico
					const options = {
						method: 'GET' as const,
						url: `https://public-api.kiwify.com/v1/balance/${legalEntityId}`,
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
