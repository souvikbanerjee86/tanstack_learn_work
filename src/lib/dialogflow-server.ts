

import { SessionsClient } from '@google-cloud/dialogflow-cx';
import { createServerFn } from '@tanstack/react-start';
import fs from 'fs';
import path from 'path';


const client = new SessionsClient({
    apiEndpoint: 'dialogflow.googleapis.com', // Change if your agent is in a different region
});

const projectId = 'project-716b1c69-ee04-40fd-ba6';
const location = 'global'; // e.g., 'us-central1'
const agentId = '01a7a4d2-bdec-43b9-9ab2-be8486843872';
const languageCode = 'en';

export const interactWithAgent = createServerFn({ method: 'POST' })
    .inputValidator((data: FormData) => data)
    .handler(async ({ data }) => {
        const sessionId = (data.get('sessionId') as string) || 'session-123';
        const textInput = data.get('text') as string | null;
        const audioFile = data.get('audio') as File | null;

        const sessionPath = client.projectLocationAgentSessionPath(
            projectId,
            location,
            agentId,
            sessionId
        );

        let queryInput;

        // --- LOGIC BRANCH: TEXT VS AUDIO ---
        if (textInput) {
            // 1. Handle Text Input
            queryInput = {
                text: {
                    text: textInput,
                },
                languageCode,
            };
        } else if (audioFile) {
            // 2. Handle Audio Input
            const arrayBuffer = await audioFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            queryInput = {
                audio: {
                    config: {
                        audioEncoding: 'AUDIO_ENCODING_WEBM_OPUS',
                        sampleRateHertz: 48000,
                    },
                    audio: buffer,
                },
                languageCode,
            };
        } else {
            throw new Error('No text or audio provided');
        }

        // 3. Construct Request (Same for both)
        const request: any = {
            session: sessionPath,
            queryInput,
            // We still request audio output even if user typed text
            outputAudioConfig: {
                audioEncoding: 'OUTPUT_AUDIO_ENCODING_MP3',
            },
        };

        const [response]: any = await client.detectIntent(request);

        return {
            text: response.queryResult?.responseMessages?.[0]?.text?.text?.[0] || '...',
            audio: response.outputAudio ? response.outputAudio.toString('base64') : null,
        };
    });