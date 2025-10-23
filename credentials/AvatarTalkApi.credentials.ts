import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AvatarTalkApi implements ICredentialType {
	name = 'avatarTalkApi';

	displayName = 'AvatarTalk API';

	icon: Icon = {light: 'file:../icons/avatartalk.svg', dark: 'file:../icons/avatartalk.dark.svg' };

	documentationUrl = 'https://github.com/avatartalk-ai/avatartalk-examples/blob/main/API.md';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your AvatarTalk API key',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.avatartalk.ai',
			url: '/inference',
			method: 'POST',
			body: {
				text: 'Test',
				avatar: 'japanese_man',
				emotion: 'neutral',
			},
		},
	};
}
