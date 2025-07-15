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
						name: 'Atualizar Webhook',
						value: 'updateWebhook',
						description: 'Atualizar um webhook específico',
						action: 'Atualizar webhook',
					},
					{
						name: 'Consultar Afiliado',
						value: 'getAffiliate',
						description: 'Obter detalhes de um afiliado específico',
						action: 'Consultar afiliado',
					},
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
						name: 'Consultar Saque',
						value: 'getPayout',
						description: 'Obter detalhes de um saque específico',
						action: 'Consultar saque',
					},
					{
						name: 'Consultar Venda',
						value: 'getSale',
						description: 'Obter detalhes de uma venda específica',
						action: 'Consultar venda',
					},
					{
						name: 'Consultar Webhook',
						value: 'getWebhook',
						description: 'Obter detalhes de um webhook específico',
						action: 'Consultar webhook',
					},
					{
						name: 'Criar Webhook',
						value: 'createWebhook',
						description: 'Criar um novo webhook',
						action: 'Criar webhook',
					},
					{
						name: 'Deletar Webhook',
						value: 'deleteWebhook',
						description: 'Deletar um webhook específico',
						action: 'Deletar webhook',
					},
					{
						name: 'Editar Afiliado',
						value: 'editAffiliate',
						description: 'Editar informações de um afiliado específico',
						action: 'Editar afiliado',
					},
					{
						name: 'Listar Afiliados',
						value: 'listAffiliates',
						description: 'Obter uma lista de todos os afiliados',
						action: 'Listar afiliados',
					},
					{
						name: 'Listar Produtos',
						value: 'listProducts',
						description: 'Obter uma lista de todos os produtos',
						action: 'Listar produtos',
					},
					{
						name: 'Listar Saques',
						value: 'listPayouts',
						description: 'Obter uma lista de todos os saques',
						action: 'Listar saques',
					},
					{
						name: 'Listar Vendas',
						value: 'listSales',
						description: 'Obter uma lista de todas as vendas',
						action: 'Listar vendas',
					},
					{
						name: 'Listar Webhooks',
						value: 'listWebhooks',
						description: 'Obter uma lista de todos os webhooks',
						action: 'Listar webhooks',
					},
					{
						name: 'Obter Detalhes Da Conta',
						value: 'getAccountDetails',
						description: 'Obter detalhes da conta Kiwify',
						action: 'Obter detalhes da conta',
					},
					{
						name: 'Realizar Saque',
						value: 'createPayout',
						description: 'Solicitar a realização de um saque',
						action: 'Realizar saque',
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
			// Parâmetro para Consultar Afiliado e Editar Afiliado
			{
				displayName: 'ID Do Afiliado',
				name: 'affiliateId',
				type: 'string',
				required: true,
				default: '',
				description: 'ID do afiliado a ser consultado ou editado',
				displayOptions: {
					show: {
						operation: ['getAffiliate', 'editAffiliate'],
					},
				},
			},
			// Parâmetro para Consultar, Atualizar e Deletar Webhook
			{
				displayName: 'ID Do Webhook',
				name: 'webhookId',
				type: 'string',
				required: true,
				default: '',
				description: 'ID do webhook a ser consultado, atualizado ou deletado',
				displayOptions: {
					show: {
						operation: ['getWebhook', 'updateWebhook', 'deleteWebhook'],
					},
				},
			},
			// Parâmetros para Criar e Atualizar Webhook
			{
				displayName: 'Nome Do Webhook',
				name: 'webhookName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['createWebhook', 'updateWebhook'],
					},
				},
			},
			{
				displayName: 'URL Do Webhook',
				name: 'webhookUrl',
				type: 'string',
				required: true,
				default: '',
				description: 'URL de destino do webhook',
				displayOptions: {
					show: {
						operation: ['createWebhook', 'updateWebhook'],
					},
				},
			},
			{
				displayName: 'Produtos',
				name: 'webhookProducts',
				type: 'string',
				default: 'all',
				description: 'ID do produto específico ou "all" para todos os produtos',
				displayOptions: {
					show: {
						operation: ['createWebhook', 'updateWebhook'],
					},
				},
			},
			{
				displayName: 'Triggers',
				name: 'webhookTriggers',
				type: 'multiOptions',
				default: [],
				description: 'Eventos que irão disparar o webhook',
				options: [
					{ name: 'Assinatura Atrasada', value: 'subscription_late' },
					{ name: 'Assinatura Cancelada', value: 'subscription_canceled' },
					{ name: 'Assinatura Renovada', value: 'subscription_renewed' },
					{ name: 'Boleto Gerado', value: 'boleto_gerado' },
					{ name: 'Carrinho Abandonado', value: 'carrinho_abandonado' },
					{ name: 'Chargeback', value: 'chargeback' },
					{ name: 'Compra Aprovada', value: 'compra_aprovada' },
					{ name: 'Compra Recusada', value: 'compra_recusada' },
					{ name: 'Compra Reembolsada', value: 'compra_reembolsada' },
					{ name: 'PIX Gerado', value: 'pix_gerado' },
				],
				displayOptions: {
					show: {
						operation: ['createWebhook', 'updateWebhook'],
					},
				},
			},
			{
				displayName: 'Token',
				name: 'webhookToken',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'Token personalizado para o webhook (opcional)',
				displayOptions: {
					show: {
						operation: ['createWebhook', 'updateWebhook'],
					},
				},
			},
			// Parâmetros para Listar Webhooks
			{
				displayName: 'Tamanho Da Página',
				name: 'pageSizeWebhooks',
				type: 'number',
				default: 10,
				description: 'Número de webhooks a retornar por página',
				displayOptions: {
					show: {
						operation: ['listWebhooks'],
					},
				},
			},
			{
				displayName: 'Número Da Página',
				name: 'pageNumberWebhooks',
				type: 'number',
				default: 1,
				description: 'Número da página a recuperar',
				displayOptions: {
					show: {
						operation: ['listWebhooks'],
					},
				},
			},
			{
				displayName: 'ID Do Produto',
				name: 'productIdWebhookFilter',
				type: 'string',
				default: '',
				description: 'Filtrar webhooks por ID do produto (opcional)',
				displayOptions: {
					show: {
						operation: ['listWebhooks'],
					},
				},
			},
			{
				displayName: 'Buscar',
				name: 'searchTermWebhooks',
				type: 'string',
				default: '',
				description: 'Termo de busca para filtrar webhooks (opcional)',
				displayOptions: {
					show: {
						operation: ['listWebhooks'],
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
			// Parâmetros para Editar Afiliado
			{
				displayName: 'Comissão',
				name: 'affiliateCommission',
				type: 'number',
				default: 0,
				description: 'Nova comissão do afiliado (opcional)',
				displayOptions: {
					show: {
						operation: ['editAffiliate'],
					},
				},
			},
			{
				displayName: 'Status',
				name: 'affiliateStatus',
				type: 'options',
				default: 'active',
				description: 'Novo status do afiliado (opcional)',
				options: [
					{ name: 'Ativo', value: 'active' },
					{ name: 'Bloqueado', value: 'blocked' },
					{ name: 'Recusado', value: 'refused' },
				],
				displayOptions: {
					show: {
						operation: ['editAffiliate'],
					},
				},
			},
			// Parâmetros para Listar Afiliados
			{
				displayName: 'Tamanho Da Página',
				name: 'pageSizeAffiliates',
				type: 'number',
				default: 10,
				description: 'Número de afiliados a retornar por página',
				displayOptions: {
					show: {
						operation: ['listAffiliates'],
					},
				},
			},
			{
				displayName: 'Número Da Página',
				name: 'pageNumberAffiliates',
				type: 'number',
				default: 1,
				description: 'Número da página a recuperar',
				displayOptions: {
					show: {
						operation: ['listAffiliates'],
					},
				},
			},
			{
				displayName: 'Status',
				name: 'statusFilter',
				type: 'options',
				default: '',
				description: 'Filtrar afiliados por status',
				options: [
					{ name: 'Todos', value: '' },
					{ name: 'Ativo', value: 'active' },
					{ name: 'Bloqueado', value: 'blocked' },
					{ name: 'Recusado', value: 'refused' },
				],
				displayOptions: {
					show: {
						operation: ['listAffiliates'],
					},
				},
			},
			{
				displayName: 'ID Do Produto',
				name: 'productIdAffiliateFilter',
				type: 'string',
				default: '',
				description: 'Filtrar afiliados por ID do produto (opcional)',
				displayOptions: {
					show: {
						operation: ['listAffiliates'],
					},
				},
			},
			{
				displayName: 'Buscar',
				name: 'searchTerm',
				type: 'string',
				default: '',
				description: 'Termo de busca para filtrar afiliados (opcional)',
				displayOptions: {
					show: {
						operation: ['listAffiliates'],
					},
				},
			},
			// Parâmetro para Consultar Saque
			{
				displayName: 'ID Do Saque',
				name: 'payoutId',
				type: 'string',
				required: true,
				default: '',
				description: 'ID do saque a ser consultado',
				displayOptions: {
					show: {
						operation: ['getPayout'],
					},
				},
			},
			// Parâmetro para Realizar Saque
			{
				displayName: 'Valor Do Saque',
				name: 'payoutAmount',
				type: 'number',
				required: true,
				default: 0,
				description: 'Valor do saque a ser solicitado (em centavos)',
				displayOptions: {
					show: {
						operation: ['createPayout'],
					},
				},
			},
			// Parâmetros para Listar Saques
			{
				displayName: 'Legal Entity ID',
				name: 'legalEntityIdFilter',
				type: 'string',
				default: '',
				description: 'Filtrar saques por Legal Entity ID (opcional)',
				displayOptions: {
					show: {
						operation: ['listPayouts'],
					},
				},
			},
			{
				displayName: 'Tamanho Da Página',
				name: 'pageSizePayouts',
				type: 'number',
				default: 10,
				description: 'Número de saques a retornar por página',
				displayOptions: {
					show: {
						operation: ['listPayouts'],
					},
				},
			},
			{
				displayName: 'Número Da Página',
				name: 'pageNumberPayouts',
				type: 'number',
				default: 1,
				description: 'Número da página a recuperar',
				displayOptions: {
					show: {
						operation: ['listPayouts'],
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
				} else if (operation === 'listPayouts') {
					// Obter parâmetros para listar saques
					const legalEntityIdFilter = this.getNodeParameter('legalEntityIdFilter', i) as string;
					const pageSizePayouts = this.getNodeParameter('pageSizePayouts', i) as number;
					const pageNumberPayouts = this.getNodeParameter('pageNumberPayouts', i) as number;

					// Construir parâmetros de consulta
					const queryParams: string[] = [];
					if (legalEntityIdFilter) queryParams.push(`legal_entity_id=${legalEntityIdFilter}`);
					if (pageSizePayouts) queryParams.push(`page_size=${pageSizePayouts}`);
					if (pageNumberPayouts) queryParams.push(`page_number=${pageNumberPayouts}`);

					// Fazer requisição à API para listar saques
					const options = {
						method: 'GET' as const,
						url: `https://public-api.kiwify.com/v1/payouts${queryParams.length ? '?' + queryParams.join('&') : ''}`,
						headers: {
							'Authorization': `Bearer ${accessToken}`,
							'x-kiwify-account-id': credentials.accountId as string,
						},
						json: true,
					};

					responseData = await this.helpers.request(options);
				} else if (operation === 'getPayout') {
					// Obter parâmetro do ID do saque
					const payoutId = this.getNodeParameter('payoutId', i) as string;

					// Fazer requisição à API para consultar saque específico
					const options = {
						method: 'GET' as const,
						url: `https://public-api.kiwify.com/v1/payouts/${payoutId}`,
						headers: {
							'Authorization': `Bearer ${accessToken}`,
							'x-kiwify-account-id': credentials.accountId as string,
						},
						json: true,
					};

					responseData = await this.helpers.request(options);
				} else if (operation === 'createPayout') {
					// Obter parâmetro do valor do saque
					const payoutAmount = this.getNodeParameter('payoutAmount', i) as number;

					// Construir body da requisição
					const body = {
						amount: payoutAmount,
					};

					// Fazer requisição à API para criar saque
					const options = {
						method: 'POST' as const,
						url: 'https://public-api.kiwify.com/v1/payouts/',
						headers: {
							'Authorization': `Bearer ${accessToken}`,
							'x-kiwify-account-id': credentials.accountId as string,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(body),
						json: true,
					};

					responseData = await this.helpers.request(options);
				} else if (operation === 'listAffiliates') {
					// Obter parâmetros para listar afiliados
					const pageSizeAffiliates = this.getNodeParameter('pageSizeAffiliates', i) as number;
					const pageNumberAffiliates = this.getNodeParameter('pageNumberAffiliates', i) as number;
					const statusFilter = this.getNodeParameter('statusFilter', i) as string;
					const productIdAffiliateFilter = this.getNodeParameter('productIdAffiliateFilter', i) as string;
					const searchTerm = this.getNodeParameter('searchTerm', i) as string;

					// Construir parâmetros de consulta
					const queryParams: string[] = [];
					if (pageSizeAffiliates) queryParams.push(`page_size=${pageSizeAffiliates}`);
					if (pageNumberAffiliates) queryParams.push(`page_number=${pageNumberAffiliates}`);
					if (statusFilter) queryParams.push(`status=${statusFilter}`);
					if (productIdAffiliateFilter) queryParams.push(`product_id=${productIdAffiliateFilter}`);
					if (searchTerm) queryParams.push(`search=${searchTerm}`);

					// Fazer requisição à API para listar afiliados
					const options = {
						method: 'GET' as const,
						url: `https://public-api.kiwify.com/v1/affiliates${queryParams.length ? '?' + queryParams.join('&') : ''}`,
						headers: {
							'Authorization': `Bearer ${accessToken}`,
							'x-kiwify-account-id': credentials.accountId as string,
						},
						json: true,
					};

					responseData = await this.helpers.request(options);
				} else if (operation === 'getAffiliate') {
					// Obter parâmetro do ID do afiliado
					const affiliateId = this.getNodeParameter('affiliateId', i) as string;

					// Fazer requisição à API para consultar afiliado específico
					const options = {
						method: 'GET' as const,
						url: `https://public-api.kiwify.com/v1/affiliates/${affiliateId}`,
						headers: {
							'Authorization': `Bearer ${accessToken}`,
							'x-kiwify-account-id': credentials.accountId as string,
						},
						json: true,
					};

					responseData = await this.helpers.request(options);
				} else if (operation === 'editAffiliate') {
					// Obter parâmetros para editar afiliado
					const affiliateId = this.getNodeParameter('affiliateId', i) as string;
					const affiliateCommission = this.getNodeParameter('affiliateCommission', i) as number;
					const affiliateStatus = this.getNodeParameter('affiliateStatus', i) as string;

					// Construir body da requisição
					const body: any = {};
					if (affiliateCommission > 0) {
						body.commission = affiliateCommission;
					}
					if (affiliateStatus) {
						body.status = affiliateStatus;
					}

					// Fazer requisição à API para editar afiliado
					const options = {
						method: 'PUT' as const,
						url: `https://public-api.kiwify.com/v1/affiliates/${affiliateId}`,
						headers: {
							'Authorization': `Bearer ${accessToken}`,
							'x-kiwify-account-id': credentials.accountId as string,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(body),
						json: true,
					};

					responseData = await this.helpers.request(options);
				} else if (operation === 'listWebhooks') {
					// Obter parâmetros para listar webhooks
					const pageSizeWebhooks = this.getNodeParameter('pageSizeWebhooks', i) as number;
					const pageNumberWebhooks = this.getNodeParameter('pageNumberWebhooks', i) as number;
					const productIdWebhookFilter = this.getNodeParameter('productIdWebhookFilter', i) as string;
					const searchTermWebhooks = this.getNodeParameter('searchTermWebhooks', i) as string;

					// Construir parâmetros de consulta
					const queryParams: string[] = [];
					if (pageSizeWebhooks) queryParams.push(`page_size=${pageSizeWebhooks}`);
					if (pageNumberWebhooks) queryParams.push(`page_number=${pageNumberWebhooks}`);
					if (productIdWebhookFilter) queryParams.push(`product_id=${productIdWebhookFilter}`);
					if (searchTermWebhooks) queryParams.push(`search=${searchTermWebhooks}`);

					// Fazer requisição à API para listar webhooks
					const options = {
						method: 'GET' as const,
						url: `https://public-api.kiwify.com/v1/webhooks${queryParams.length ? '?' + queryParams.join('&') : ''}`,
						headers: {
							'Authorization': `Bearer ${accessToken}`,
							'x-kiwify-account-id': credentials.accountId as string,
						},
						json: true,
					};

					responseData = await this.helpers.request(options);
				} else if (operation === 'getWebhook') {
					// Obter parâmetro do ID do webhook
					const webhookId = this.getNodeParameter('webhookId', i) as string;

					// Fazer requisição à API para consultar webhook específico
					const options = {
						method: 'GET' as const,
						url: `https://public-api.kiwify.com/v1/webhooks/${webhookId}`,
						headers: {
							'Authorization': `Bearer ${accessToken}`,
							'x-kiwify-account-id': credentials.accountId as string,
						},
						json: true,
					};

					responseData = await this.helpers.request(options);
				} else if (operation === 'createWebhook') {
					// Obter parâmetros para criar webhook
					const webhookName = this.getNodeParameter('webhookName', i) as string;
					const webhookUrl = this.getNodeParameter('webhookUrl', i) as string;
					const webhookProducts = this.getNodeParameter('webhookProducts', i) as string;
					const webhookTriggers = this.getNodeParameter('webhookTriggers', i) as string[];
					const webhookToken = this.getNodeParameter('webhookToken', i) as string;

					// Construir body da requisição
					const body: any = {
						name: webhookName,
						url: webhookUrl,
						products: webhookProducts,
						triggers: webhookTriggers,
					};
					if (webhookToken) {
						body.token = webhookToken;
					}

					// Fazer requisição à API para criar webhook
					const options = {
						method: 'POST' as const,
						url: 'https://public-api.kiwify.com/v1/webhooks',
						headers: {
							'Authorization': `Bearer ${accessToken}`,
							'x-kiwify-account-id': credentials.accountId as string,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(body),
						json: true,
					};

					responseData = await this.helpers.request(options);
				} else if (operation === 'updateWebhook') {
					// Obter parâmetros para atualizar webhook
					const webhookId = this.getNodeParameter('webhookId', i) as string;
					const webhookName = this.getNodeParameter('webhookName', i) as string;
					const webhookUrl = this.getNodeParameter('webhookUrl', i) as string;
					const webhookProducts = this.getNodeParameter('webhookProducts', i) as string;
					const webhookTriggers = this.getNodeParameter('webhookTriggers', i) as string[];
					const webhookToken = this.getNodeParameter('webhookToken', i) as string;

					// Construir body da requisição
					const body: any = {
						name: webhookName,
						url: webhookUrl,
						products: webhookProducts,
						triggers: webhookTriggers,
					};
					if (webhookToken) {
						body.token = webhookToken;
					}

					// Fazer requisição à API para atualizar webhook
					const options = {
						method: 'PUT' as const,
						url: `https://public-api.kiwify.com/v1/webhooks/${webhookId}`,
						headers: {
							'Authorization': `Bearer ${accessToken}`,
							'x-kiwify-account-id': credentials.accountId as string,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(body),
						json: true,
					};

					responseData = await this.helpers.request(options);
				} else if (operation === 'deleteWebhook') {
					// Obter parâmetro do ID do webhook
					const webhookId = this.getNodeParameter('webhookId', i) as string;

					// Fazer requisição à API para deletar webhook
					const options = {
						method: 'DELETE' as const,
						url: `https://public-api.kiwify.com/v1/webhooks/${webhookId}`,
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
