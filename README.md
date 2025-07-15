# n8n-nodes-kiwify

![logo](logo.png)

Este é um node da comunidade n8n que permite integrar com a API da Kiwify. Ele possibilita acessar vários serviços e dados da Kiwify dentro dos seus workflows do n8n.

[Kiwify](https://kiwify.com.br/) é uma plataforma de vendas de produtos digitais que permite criadores venderem cursos, ebooks e outros conteúdos digitais.

## Instalação

Siga o [guia de instalação](https://docs.n8n.io/integrations/community-nodes/installation/) na documentação de nodes da comunidade do n8n.

## Operações

### Conta
- **Obter Detalhes da Conta**: Recupera detalhes sobre sua conta Kiwify

### Produtos
- **Listar Produtos**: Obtenha uma lista de todos os produtos
  - **Page Size** (opcional): Número de produtos a retornar por página (padrão: 10)
  - **Page Number** (opcional): Número da página a recuperar (padrão: 1)
- **Consultar Produto**: Obtenha os detalhes de um produto específico
  - **ID Do Produto** (obrigatório): ID do produto a ser consultado

### Vendas
- **Listar Vendas**: Obtenha uma lista de todas as vendas
  - **Data De Início** (obrigatório): Data de início para buscar vendas (formato: YYYY-MM-DD)
  - **Data De Fim** (obrigatório): Data de fim para buscar vendas (formato: YYYY-MM-DD)
  - **Status** (opcional): Filtrar vendas por status
  - **Método De Pagamento** (opcional): Filtrar vendas por método de pagamento
  - **ID Do Produto** (opcional): Filtrar vendas por ID do produto
  - **Detalhes Completos Da Venda** (opcional): Se deve retornar detalhes completos da venda
- **Consultar Venda**: Obtenha os detalhes de uma venda específica
  - **ID Da Venda** (obrigatório): ID da venda a ser consultada
- **Reembolsar Venda**: Reembolse uma venda específica
  - **ID Da Venda** (obrigatório): ID da venda a ser reembolsada
  - **Chave PIX** (opcional): Chave PIX para reembolso
- **Consultar Estatísticas De Vendas**: Obtenha estatísticas de vendas
  - **Data De Início** (obrigatório): Data de início para estatísticas (formato: YYYY-MM-DD)
  - **Data De Fim** (obrigatório): Data de fim para estatísticas (formato: YYYY-MM-DD)
  - **ID Do Produto** (opcional): ID do produto para estatísticas específicas

### Financeiro
- **Consultar Saldos**: Obtenha todos os saldos da conta
- **Consultar Saldo Específico**: Obtenha um saldo específico por Legal Entity ID
  - **Legal Entity ID** (obrigatório): ID da entidade legal para consultar saldo específico

## Credenciais

Para usar este node, você precisa configurar as credenciais da API da Kiwify:

1. **Client ID**: Seu Client ID da API Kiwify
2. **Client Secret**: Seu Client Secret da API Kiwify
3. **Account ID**: Seu Account ID da Kiwify

### Como obter suas credenciais:

1. Faça login no seu painel da Kiwify
2. Navegue para Apps > API > Criar Chave API
3. Copie o `client_id`
4. Copie o `client_secret`
5. Copie o `account_id` da mesma página

O node automaticamente gerenciará o fluxo OAuth 2.0:
1. Usando seu Client ID e Client Secret para obter um access token
2. Usando o access token e Account ID para requisições subsequentes da API

### Fluxo de Autenticação:

O node implementa o fluxo OAuth 2.0 completo conforme especificado na documentação da API da Kiwify:

1. **Requisição de Token**: `POST /oauth/token` com client_id e client_secret
2. **Requisições da API**: Usa o access_token retornado no cabeçalho Authorization junto com x-kiwify-account-id

Para mais informações sobre autenticação, visite a [documentação da API da Kiwify](https://docs.kiwify.com.br/api-reference/general).

## Recursos

* [Documentação de nodes da comunidade n8n](https://docs.n8n.io/integrations/community-nodes/)
* [Documentação da API da Kiwify](https://docs.kiwify.com.br/api-reference/general)

## Histórico de versões

### 0.1.0
- Lançamento inicial
- Adicionada operação de detalhes da conta
- Integração básica com a API da Kiwify

## Licença

[MIT](https://github.com/99labdev/n8n-nodes-kiwify/blob/master/LICENSE.md)
