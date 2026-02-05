import { createServerFn } from '@tanstack/react-start';
import { GoogleAuth } from 'google-auth-library';
import { API_PATH } from './api-path';
import { BucketListResponse } from './types';

const auth = new GoogleAuth();

export const fetchBucketListInfo = createServerFn({ method: 'GET' }).handler(async (): Promise<BucketListResponse> => {

    const client = await auth.getIdTokenClient(API_PATH.BUCKET_LIST_API.GET_BASE_URL);
    const url = API_PATH.BUCKET_LIST_API.GET_BASE_URL + API_PATH.BUCKET_LIST_API.PATH_URL;
    const response = await client.request({
        url: url,
        method: 'GET',
    });
    const data = await response.data;
    return data as BucketListResponse;
})