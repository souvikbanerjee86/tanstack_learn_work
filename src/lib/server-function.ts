import { createServerFn } from '@tanstack/react-start';
import { GoogleAuth } from 'google-auth-library';
import { API_PATH } from './api-path';
import { BucketListResponse, ProfileSearchResponse, RagProcessRecord } from './types';
import { db } from './db.server'
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
    .inputValidator((data: { jobDescription: string, preferedDomain: string, skills: string, experience: number }) => data)
    .handler(async ({ data }): Promise<ProfileSearchResponse> => {

        const client = await auth.getIdTokenClient(API_PATH.RAG_SEARCH_API.GET_BASE_URL);
        const url = API_PATH.RAG_SEARCH_API.GET_BASE_URL + API_PATH.RAG_SEARCH_API.PATH_URL;


        const postData = {
            "job_description": data.jobDescription,
            "years_of_experience": data.experience,
            "primary_skills": data.skills.split(','),
            "prefered_domain": data.preferedDomain
        }
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


// export const getProcessedIndex = createServerFn({ method: 'GET' }).handler(async (): Promise<RagProcessRecord[]> => {
//     try {
//         const data = await db.collection('rag_file_updates')
//             .orderBy('processed_at', 'desc')
//             .get()

//         const uniqueMap = new Map()

//         data.docs.forEach(doc => {
//             const data = doc.data()
//             const key = data.date
//             if (!uniqueMap.has(key)) {
//                 uniqueMap.set(key, {
//                     id: doc.id,
//                     ...data,
//                     processed_at: data.processed_at?.toDate().toISOString()
//                 })
//             }
//         })
//         return Array.from(uniqueMap.values())


//     } catch (error) {
//         console.error('Error fetching Firestore collection:', error)
//         throw new Error('Internal Server Error')
//     }
// })