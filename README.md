# n8n-nodes-avatartalk

This is an n8n community node. It lets you use AvatarTalk AI in your n8n workflows.

AvatarTalk is an AI-powered service that generates realistic avatar videos with text-to-speech capabilities, supporting multiple languages, avatars, and emotions.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

The AvatarTalk node supports three inference modes:

- **Standard Inference** - Generate avatar video immediately and return complete metadata with the video URL
- **Streaming Inference** - Stream video in real-time and return it as binary data in n8n
- **Delayed Inference** - Defer video processing until the URL is accessed (lazy generation)

## Credentials

To use this node, you need an AvatarTalk API key:

1. Go to [https://avatartalk.ai](https://avatartalk.ai)
2. Create an account or sign in
3. Navigate to your dashboard
4. Copy your API Key
5. In n8n, create new AvatarTalk API credentials and paste your API key

## Compatibility

This node is compatible with n8n version 1.0.0 and above. It has been tested with the latest n8n versions.

## Usage

### Choosing the Right Operation Mode

The AvatarTalk node offers three different operation modes to suit different use cases:

#### Standard Inference
Use this mode when you need the video URL and metadata immediately. The API processes the video synchronously and returns a complete response with:
- Video URL
- Duration
- File size
- Other metadata

Best for: Simple workflows where you need immediate results and don't need real-time streaming.

#### Streaming Inference
Use this mode for real-time video generation. The video is generated and streamed as it becomes available, and returned as binary data in n8n.

The video file is stored in n8n's binary data format, making it available for:
- Direct downloading from n8n
- Further processing in subsequent workflow nodes
- Storage to cloud services (S3, Google Drive, etc.)
- Sending via email or webhooks

Best for:
- Workflows where you need to process or store the video file directly
- Integration with other n8n nodes that work with binary data
- Scenarios where you want the video content within your workflow rather than just a URL

#### Delayed Inference
Use this mode when you want to defer the actual video processing. The API returns a URL immediately, but the video is only generated when someone accesses that URL for the first time.

Best for:
- Generating many videos where not all will be viewed
- Reducing API costs by only processing videos that are actually needed
- Batch operations where immediate generation isn't required

### Avatar and Emotion Options

The node supports 14 different avatar characters:
- African Man, African Woman
- Arab Man, Arab Woman
- Colombian Woman
- European Man, European Woman
- Iranian Man
- Japanese Man, Japanese Woman
- Mexican Man, Mexican Woman
- Old European Woman, Old Japanese Man

Each avatar can express three emotions:
- Happy
- Neutral
- Serious

### Language Support

Specify a language code for speech synthesis. Supported languages include:
- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German
- `ja` - Japanese
- And many more

Refer to the [AvatarTalk API documentation](https://github.com/avatartalk-ai/avatartalk-examples/blob/main/API.md) for the complete list of supported languages.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [AvatarTalk API documentation](https://github.com/avatartalk-ai/avatartalk-examples/blob/main/API.md)
- [AvatarTalk website](https://avatartalk.ai)
