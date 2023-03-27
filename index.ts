import axios from "axios";
import {ISetupOptions} from "./types";

let API_URL =  'https://api.x-tkn.com'
let API_KEY_ID = process.env.X_TKN_API_KEY_ID || process.env.REACT_APP_X_TKN_API_KEY_ID || process.env.VUE_APP_X_TKN_API_KEY_ID || ''

export async function setup (options: ISetupOptions = {}) {

    if (options.apiUrl) API_URL = options.apiUrl;
    if (options.apiKeyId) API_KEY_ID = options.apiKeyId;
}

export async function createToken(props: unknown) {

    return await post(`/tokens/create`, props)
}

export async function deleteToken(tokenId: string) {

    return await del(`/tokens/${tokenId}`)
}

export async function readToken(tokenId: string) {

    return await get(`/tokens/${tokenId}/read`)
}

export async function redeemToken(tokenId: string) {

    return await patch(`/tokens/${tokenId}/redeem`)
}

export async function revokeToken(tokenId: string) {

    return await patch(`/tokens/${tokenId}/revoke`)
}

// helpers

async function del(url: string) {
    try {
        let {data} = await axios.delete(`${API_URL}${url}`, config())

        return sanitize(data);

    } catch (err) {

        handleError(err)
    }
}

async function get(url: string) {
    try {
        let {data} = await axios.get(`${API_URL}${url}`, config())

        return sanitize(data);

    } catch (err) {

        handleError(err)
    }
}

async function patch(url: string, props?: unknown) {
    try {
        let {data} = await axios.patch(`${API_URL}${url}`, props, config())

        return sanitize(data);

    } catch (err) {

        handleError(err)
    }
}

async function post(url: string, props?: unknown) {
    try {
        let {data} = await axios.post(`${API_URL}${url}`, props, config())

        return sanitize(data);

    } catch (err) {

        handleError(err)
    }
}

function sanitize(data?: any) {

    if(!data) return null;
    return data;
}

function config() {
    return {headers: {authorization: API_KEY_ID}}
}

function handleError(err: any) {

    console.error(err)

    if (err?.response) {

        let {data} = err?.response || {};

        throw new Error(data)
    }
}

