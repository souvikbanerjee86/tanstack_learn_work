

import { SessionsClient } from '@google-cloud/dialogflow-cx';
import { createServerFn } from '@tanstack/react-start';
import { API_PATH } from './api-path';
import { GoogleAuth } from 'google-auth-library';

const auth = new GoogleAuth();

const client = new SessionsClient({
    apiEndpoint: 'dialogflow.googleapis.com',
});

const projectId = 'project-716b1c69-ee04-40fd-ba6';
const location = 'global';
const agentId = '01a7a4d2-bdec-43b9-9ab2-be8486843872';
const languageCode = 'en';

export const interactWithAgent = createServerFn({ method: 'POST' })
    .inputValidator((data: FormData) => data)
    .handler(async ({ data }) => {


        console.log(API_PATH.SPEECH_TO_TEXT.GET_BASE_URL)
        const authClient = await auth.getIdTokenClient(API_PATH.SPEECH_TO_TEXT.GET_BASE_URL);

        const sessionId = (data.get('sessionId') as string) || 'session-123';
        const textInput = data.get('text') as string | null;
        const audioFile = data.get('audio') as File | null;

        const sessionPath = client.projectLocationAgentSessionPath(
            projectId,
            location,
            agentId,
            sessionId
        );

        console.log(sessionId)

        let queryInput;
        let queryParams = {};
        if (textInput) {
            queryInput = {
                text: {
                    text: textInput,
                },
                languageCode,
            };
        }
        else if (audioFile) {

            const url = API_PATH.SPEECH_TO_TEXT.GET_BASE_URL + API_PATH.SPEECH_TO_TEXT.PATH_URL;
            const speechResponse = await authClient.request({
                url: url,
                method: 'POST',
                data: data
            });

            const returnResponse = speechResponse.data as { text: string | null, language: string | null };
            if (returnResponse.text && returnResponse.text?.length > 250) {
                queryParams = {
                    parameters: {
                        fields: {
                            long_input_content: {
                                stringValue: returnResponse.text
                            }
                        }
                    }
                }
            }
            queryInput = {
                text: {
                    text: returnResponse.text!.length > 250 ? "CHECK_PARAMS" : returnResponse.text,
                },
                languageCode,
            };
            // const arrayBuffer = await audioFile.arrayBuffer();
            // const buffer = Buffer.from(arrayBuffer);

            // queryInput = {
            //     audio: {
            //         config: {
            //             audioEncoding: 'AUDIO_ENCODING_WEBM_OPUS',
            //             sampleRateHertz: 48000,
            //         },
            //         audio: buffer,
            //     },
            //     languageCode,
            // };
        } else {
            throw new Error('No text or audio provided');
        }

        const request: any = {
            session: sessionPath,
            queryInput,
            queryParams,
            outputAudioConfig: {
                audioEncoding: 'OUTPUT_AUDIO_ENCODING_MP3',
            },
        };

        console.log(request)

        const [response]: any = await client.detectIntent(request);

        return {
            text: response.queryResult?.responseMessages?.[0]?.text?.text?.[0] || '...',
            audio: response.outputAudio ? response.outputAudio.toString('base64') : null,
        };

    });