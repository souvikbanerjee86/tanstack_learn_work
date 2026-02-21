'use server'
import { createServerFn } from '@tanstack/react-start';
import { GoogleAuth } from 'google-auth-library';
import { API_PATH } from './api-path';
import { BucketListResponse, CandidatePaginationResponse, EvaluationResponse, PaginatedJobResponse, ProfileSearchResponse, RagProcessRecord } from './types';

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

export const getJobDetails = createServerFn({ method: 'GET' })
    .inputValidator((data: { limit: number | null, status: string | null, last_doc_id: string | null }) => data)
    .handler(async ({ data }): Promise<PaginatedJobResponse> => {

        console.log(API_PATH.JOB_DETAILS.GET_BASE_URL)
        const client = await auth.getIdTokenClient(API_PATH.JOB_DETAILS.GET_BASE_URL);
        var url = API_PATH.JOB_DETAILS.GET_BASE_URL + API_PATH.JOB_DETAILS.PATH_URL;
        if (data.status) {
            url += `?status=${data.status}`;
        }
        if (data.limit) {
            url += `&limit=${data.limit}`;
        }
        if (data.last_doc_id) {
            url += `&last_doc_id=${data.last_doc_id}`;
        }
        const response = await client.request({
            url: url,
            method: 'GET',
        });
        const returnData = await response.data;
        return returnData as PaginatedJobResponse;

    })


export const jobInterviewCandidates = createServerFn({ method: 'GET' })
    .inputValidator((data: { job_id: string, candidates: string[] }) => data)
    .handler(async ({ data }): Promise<{ success: boolean, message: string }> => {

        const client = await auth.getIdTokenClient(API_PATH.JOB_INTERVIEW_CANDIDATES.GET_BASE_URL);
        const url = API_PATH.JOB_INTERVIEW_CANDIDATES.GET_BASE_URL + API_PATH.JOB_INTERVIEW_CANDIDATES.PATH_URL;


        const postData = {
            "job_id": data.job_id,
            "candidates": data.candidates
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
            return { "success": true, "message": "Email Initiated, Candidate will receive the interview email" }
        } catch (e) {
            return { "success": false, "message": "Indexing failed" }
        }


    })

export const getInterviewCandidateEmailList = createServerFn({ method: 'GET' })
    .inputValidator((data: { limit: number | null, last_doc_id: string | null }) => data)
    .handler(async ({ data }): Promise<CandidatePaginationResponse> => {

        console.log(API_PATH.JOB_INTERVIEW_CANDIDATE_EMAIL_LIST.GET_BASE_URL)
        const client = await auth.getIdTokenClient(API_PATH.JOB_INTERVIEW_CANDIDATE_EMAIL_LIST.GET_BASE_URL);
        var url = API_PATH.JOB_INTERVIEW_CANDIDATE_EMAIL_LIST.GET_BASE_URL + API_PATH.JOB_INTERVIEW_CANDIDATE_EMAIL_LIST.PATH_URL;

        if (data.limit) {
            url += `&limit=${data.limit}`;
        }
        if (data.last_doc_id) {
            url += `&last_doc_id=${data.last_doc_id}`;
        }
        const response = await client.request({
            url: url,
            method: 'GET',
        });
        const returnData = await response.data;
        return returnData as CandidatePaginationResponse;

    })



export const getDownloadURL = createServerFn({ method: 'GET' })
    .inputValidator((data: { bucket_name: string, file_path: string }) => data)
    .handler(async ({ data }): Promise<{ download_url: string | null }> => {

        const client = await auth.getIdTokenClient(API_PATH.DOWNLOAD_FILE_URL.GET_BASE_URL);
        const url = API_PATH.DOWNLOAD_FILE_URL.GET_BASE_URL + API_PATH.DOWNLOAD_FILE_URL.PATH_URL;


        const postData = {
            "bucket_name": data.bucket_name,
            "full_path": data.file_path
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
            const finalData = await response.data;
            return finalData as { download_url: string };
        } catch (e) {
            return { "download_url": null }
        }


    })


export const getInterviewAnswersList = createServerFn({ method: 'GET' })
    .inputValidator((data: { candidate: string, job_id: string }) => data)
    .handler(async ({ data }): Promise<EvaluationResponse> => {

        const client = await auth.getIdTokenClient(API_PATH.CANDIDATE_INTERVIEW_ANSWER_LIST.GET_BASE_URL);
        const url = API_PATH.CANDIDATE_INTERVIEW_ANSWER_LIST.GET_BASE_URL + API_PATH.CANDIDATE_INTERVIEW_ANSWER_LIST.PATH_URL;


        const postData = {
            "candidate": data.candidate,
            "job_id": data.job_id
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
            const finalData = await response.data;
            return finalData as EvaluationResponse;
        } catch (e) {
            return { "success": false, "count": 0, "data": [] }
        }


    })