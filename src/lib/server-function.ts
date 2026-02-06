import { createServerFn } from '@tanstack/react-start';
import { GoogleAuth } from 'google-auth-library';
import { API_PATH } from './api-path';
import { BucketListResponse, ProfileSearchResponse, RagProcessRecord } from './types';

const auth = new GoogleAuth();

export const fetchBucketListInfo = createServerFn({ method: 'GET' }).handler(async (): Promise<BucketListResponse> => {

    console.log(API_PATH.BUCKET_LIST_API.GET_BASE_URL)
    const client = await auth.getIdTokenClient(API_PATH.BUCKET_LIST_API.GET_BASE_URL);
    const url = API_PATH.BUCKET_LIST_API.GET_BASE_URL + API_PATH.BUCKET_LIST_API.PATH_URL;
    const response = await client.request({
        url: url,
        method: 'GET',
    });
    const data = await response.data;
    return data as BucketListResponse;
})



export const getSearchProfileDetails = createServerFn({ method: 'GET' })
    .inputValidator((data: { jobDescription: string, preferedDomain: string, skills: string, experience: number, fileIds: string[] | null }) => data)
    .handler(async ({ data }): Promise<ProfileSearchResponse> => {

        const client = await auth.getIdTokenClient(API_PATH.RAG_SEARCH_API.GET_BASE_URL);
        const url = API_PATH.RAG_SEARCH_API.GET_BASE_URL + API_PATH.RAG_SEARCH_API.PATH_URL;
        let postData: any = {
            "job_description": data.jobDescription,
            "years_of_experience": data.experience,
            "primary_skills": data.skills.split(','),
            "prefered_domain": data.preferedDomain
        }

        if (data.fileIds && data.fileIds.length > 0) {
            postData["rag_file_ids"] = data.fileIds
        }
        console.log(postData)

        const sendData = JSON.stringify(postData)
        const response = await client.request({
            url: url,
            method: 'POST',
            data: sendData,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const returnData = await response.data;
        return returnData as ProfileSearchResponse;
    })


export const getProcessedIndexFilesId = createServerFn({ method: 'GET' }).handler(async (): Promise<RagProcessRecord[]> => {

    console.log(API_PATH.PROCESSED_FILES_ID.GET_BASE_URL)
    const client = await auth.getIdTokenClient(API_PATH.PROCESSED_FILES_ID.GET_BASE_URL);
    const url = API_PATH.PROCESSED_FILES_ID.GET_BASE_URL + API_PATH.PROCESSED_FILES_ID.PATH_URL;
    const response = await client.request({
        url: url,
        method: 'GET',
    });
    const data = await response.data;
    return data as RagProcessRecord[];
})


export const triggerIndexes = createServerFn({ method: 'GET' })
    .inputValidator((data: { date: string }) => data)
    .handler(async ({ data }): Promise<{ success: boolean, message: string }> => {

        const client = await auth.getIdTokenClient(API_PATH.TRIGGER_INDEX.GET_BASE_URL);
        const url = API_PATH.TRIGGER_INDEX.GET_BASE_URL + API_PATH.TRIGGER_INDEX.PATH_URL;


        const postData = {
            "date": data.date,
            "corpus_id": API_PATH.TRIGGER_INDEX.CORPUS_ID
        }
        const sendData = JSON.stringify(postData)
        try {
            const response = await client.request({
                url: url,
                method: 'POST',
                data: sendData,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            await response.data;
            return { "success": true, "message": "Indexing triggered successfully" }
        } catch (e) {
            return { "success": false, "message": "Indexing failed" }
        }


    })