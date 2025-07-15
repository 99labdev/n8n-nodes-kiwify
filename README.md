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

1. **Bearer Token**: Your OAuth Bearer token from Kiwify
2. **Account ID**: Your Kiwify Account ID (x-kiwify-account-id header)

### How to get your credentials:

1. Log in to your Kiwify dashboard
2. Navigate to Apps > API > Create API Key
3. Copy the `client_secret` (this will be your Bearer Token)
4. Copy the `account_id` from the same page

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
