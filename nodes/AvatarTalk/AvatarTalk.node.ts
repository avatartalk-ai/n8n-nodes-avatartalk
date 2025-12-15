import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	Icon,
} from 'n8n-workflow';
import { NodeOperationError, NodeConnectionTypes } from 'n8n-workflow';

interface AvatarRequest {
	text: string,
	avatar: string,
	emotion: string,
	language?: string | null | undefined
}

export class AvatarTalk implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'AvatarTalk',
		name: 'avatarTalk',
		icon: { light: 'file:../../icons/avatartalk.svg', dark: 'file:../../icons/avatartalk.dark.svg' } as Icon,
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Generate AI avatar videos using AvatarTalk API',
		defaults: {
			name: 'AvatarTalk',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'avatarTalkApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'hidden',
				noDataExpression: true,
				options: [
					{
						name: 'Video',
						value: 'video',
					},
				],
				default: 'video',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Standard Inference',
						value: 'standard',
						description: 'Generate avatar video immediately and return complete metadata',
						action: 'Generate video with standard inference',
					},
					{
						name: 'Streaming Inference',
						value: 'streaming',
						description: 'Stream video chunks as they are generated in real-time',
						action: 'Generate video with streaming inference',
					},
					{
						name: 'Delayed Inference',
						value: 'delayed',
						description: 'Defer video processing until the URL is accessed',
						action: 'Generate video with delayed inference',
					},
				],
				default: 'standard',
			},
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				default: '',
				required: true,
				description: 'The text to be spoken by the avatar',
				typeOptions: {
					rows: 4,
				},
			},
			{
				displayName: 'Avatar',
				name: 'avatar',
				type: 'options',
				options: [
					{
						name: 'African Man',
						value: 'african_man',
					},
					{
						name: 'African Woman',
						value: 'african_woman',
					},
					{
						name: 'Arab Man',
						value: 'arab_man',
					},
					{
						name: 'Arab Woman',
						value: 'arab_woman',
					},
					{
						name: 'Colombian Woman',
						value: 'colombian_woman',
					},
					{
						name: 'European Man',
						value: 'european_man',
					},
					{
						name: 'European Woman',
						value: 'european_woman',
					},
					{
						name: 'Iranian Man',
						value: 'iranian_man',
					},
					{
						name: 'Japanese Man',
						value: 'japanese_man',
					},
					{
						name: 'Japanese Woman',
						value: 'japanese_woman',
					},
					{
						name: 'Mexican Man',
						value: 'mexican_man',
					},
					{
						name: 'Mexican Woman',
						value: 'mexican_woman',
					},
					{
						name: 'Old European Woman',
						value: 'old_european_woman',
					},
					{
						name: 'Old Japanese Man',
						value: 'old_japanese_man',
					},
				],
				default: 'japanese_man',
				required: true,
				description: 'The avatar character to use',
			},
			{
				displayName: 'Emotion',
				name: 'emotion',
				type: 'options',
				options: [
					{
						name: 'Happy',
						value: 'happy',
					},
					{
						name: 'Neutral',
						value: 'neutral',
					},
					{
						name: 'Serious',
						value: 'serious',
					},
				],
				default: 'neutral',
				required: true,
				description: 'The emotion/expression for the avatar',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: 'en',
				description: 'Language code for speech synthesis (e.g., en, es, fr, de, ja)',
			},
		],
		usableAsTool: true,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const text = this.getNodeParameter('text', i) as string;
				const avatar = this.getNodeParameter('avatar', i) as string;
				const emotion = this.getNodeParameter('emotion', i) as string;
				const language = this.getNodeParameter('language', i) as string;

				const body: AvatarRequest = {
					text,
					avatar,
					emotion,
				};

				if (language) {
					body.language = language;
				}

				if (operation === 'standard') {
					// Standard inference - immediate processing
					const options: IHttpRequestOptions = {
						method: 'POST',
						url: 'https://api.avatartalk.ai/inference',
						headers: {
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'avatarTalkApi',
						options,
					);

					returnData.push({
						json: response,
						pairedItem: { item: i },
					});

				} else if (operation === 'streaming') {
					// Streaming inference - returns video as a binary blob
					const options: IHttpRequestOptions = {
						method: 'POST',
						url: 'https://api.avatartalk.ai/inference?stream=true',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(body),
						returnFullResponse: false,
						encoding: 'arraybuffer',
					};

					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'avatarTalkApi',
						options,
					);
					const binaryData = await this.helpers.prepareBinaryData(
						response,
						'avatar_video.mp4',
						'video/mp4',
					);

					returnData.push({
						json: {},
						binary: {
							video: binaryData,
						},
						pairedItem: { item: i },
						});

				} else if (operation === 'delayed') {
					// Delayed inference - lazy generation
					const options: IHttpRequestOptions = {
						method: 'POST',
						url: 'https://api.avatartalk.ai/inference?delayed=true',
						headers: {
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'avatarTalkApi',
						options,
					);

					returnData.push({
						json: response,
						pairedItem: { item: i },
					});
				}

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error, {
					itemIndex: i,
					description: error.message,
				});
			}
		}

		return [returnData];
	}
}
