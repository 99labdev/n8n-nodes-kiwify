# n8n-nodes-kiwify

This is an n8n community node that allows you to integrate with the Kiwify API. It enables you to access various Kiwify services and data within your n8n workflows.

[Kiwify](https://kiwify.com.br/) is a digital product sales platform that allows creators to sell courses, ebooks, and other digital content.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Account
- **Get Account Details**: Retrieve details about your Kiwify account

## Credentials

To use this node, you need to configure the Kiwify API credentials:

1. **Client ID**: Your Kiwify API Client ID
2. **Client Secret**: Your Kiwify API Client Secret
3. **Account ID**: Your Kiwify Account ID

### How to get your credentials:

1. Log in to your Kiwify dashboard
2. Navigate to Apps > API > Create API Key
3. Copy the `client_id` 
4. Copy the `client_secret`
5. Copy the `account_id` from the same page

The node will automatically handle the OAuth 2.0 flow by:
1. Using your Client ID and Client Secret to obtain an access token
2. Using the access token and Account ID for subsequent API requests

### Authentication Flow:

The node implements the complete OAuth 2.0 flow as specified in the Kiwify API documentation:

1. **Token Request**: `POST /oauth/token` with client_id and client_secret
2. **API Requests**: Uses the returned access_token in Authorization header along with x-kiwify-account-id

For more information on authentication, visit the [Kiwify API documentation](https://docs.kiwify.com.br/api-reference/general).

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Kiwify API documentation](https://docs.kiwify.com.br/api-reference/general)

## Version history

### 0.1.0
- Initial release
- Added account details operation
- Basic Kiwify API integration

## License

[MIT](https://github.com/99labdev/n8n-nodes-kiwify/blob/master/LICENSE.md)
