# Como testar localmente

## Pré-req3. Adicione uma nova credencial "Kiwify API":
   - **Client ID**: Seu Client ID da Kiwify API
   - **Client Secret**: Seu Client Secret da Kiwify API
   - **Account ID**: Seu Account ID da Kiwifyitos

1. Instale o n8n globalmente:
```bash
npm install n8n -g
```

2. Faça o build do projeto:
```bash
npm run build
```

## Instalação local

1. Para usar este node localmente, você precisa fazer um link simbólico:
```bash
# Na pasta do projeto
npm link

# Na pasta global do n8n ou em um projeto que usar o n8n
npm link n8n-nodes-kiwify
```

## Configuração das credenciais

1. Inicie o n8n:
```bash
n8n start
```

2. Acesse http://localhost:5678

3. Vá para Settings > Credentials

4. Adicione uma nova credencial "Kiwify API":
   - **Bearer Token**: Seu token OAuth da Kiwify
   - **Account ID**: Seu Account ID da Kiwify

## Testando o node

1. Crie um novo workflow
2. Adicione o node "Kiwify"
3. Configure as credenciais
4. Selecione a operação "Get Account Details"
5. Execute o workflow

## Exemplo de resposta

```json
{
  "id": "XvS0qfkdzCZTg8z",
  "company_name": "Teste LTDA",
  "director_cpf": "99999999999",
  "company_cnpj": "99999999999999",
  "legal_entities": [
    {
      "id": "d644de3d-9a02-46b1-aed4-72785fe8828f",
      "active": true,
      "company_name": "Teste LTDA",
      "director_cpf": "99999999999",
      "company_cnpj": "",
      "pix_key": "99999999999",
      "created_at": "2023-05-31T12:23:59.746Z",
      "updated_at": "2023-09-27T18:10:37.697Z"
    }
  ]
}
```
