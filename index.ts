import axios from "axios";
import {ISetupOptions, IToken, ITokenInput} from "./types";

let API_URL = 'https://api.x-tkn.com'
let API_KEY_ID = findApiKey()

export async function setup(options: ISetupOptions = {}) {

    if (options.apiUrl) API_URL = options.apiUrl;
    if (options.apiKeyId) API_KEY_ID = options.apiKeyId;
}

export async function createSecurityToken(refId?: string, ttl: any = {hours: 2}): Promise<IToken> {

    let props = {
        type: 'security',
        refId,
        expiresAt: addToDate(ttl),
        maxUses: 1
    }

    return await post(`/tokens/create`, props)
}

export async function createToken(props?: ITokenInput): Promise<IToken> {

    return await post(`/tokens/create`, props)
}

export async function deleteToken(tokenId: string): Promise<void> {

    await del(`/tokens/${tokenId}`)
}

export async function extendExpiration(tokenId: string, ttl: any = {hours: 1}): Promise<any | null> {

    let updates = {expiresAt: addToDate(ttl)}

    return updateToken(tokenId, updates)
}

export async function listTokens(where?: any, orderBy?: any, skip?: number, take?: number): Promise<any | null> {

    let data = {where, orderBy, skip, take}

    return await post(`/tokens/list`, data)
}

export async function readToken(tokenId: string): Promise<IToken | null> {

    return await get(`/tokens/${tokenId}/read`)
}

export async function redeemToken(tokenId: string): Promise<IToken | null> {

    return await patch(`/tokens/${tokenId}/redeem`)
}

export async function revokeToken(tokenId: string): Promise<IToken | null> {

    return await patch(`/tokens/${tokenId}/revoke`)
}

/*
export async function revokeTokens(where: any): Promise<any | null> {

    if (!where) return []

    return await post(`/tokens/revoke`, where)
}
*/

export async function updateToken(tokenId: string, updates = {}): Promise<any | null> {

    return await patch(`/tokens/${tokenId}/update`, updates)
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

    if (!data) return null;
    return data;
}

function config() {

    return {headers: {authorization: API_KEY_ID}}
}

function handleError(err: any) {

    if (err?.response) {

        let {data} = err?.response || {};

        throw new Error(data)
    }
}

function addToDate(obj: any) {

    const currentDate = new Date();

    if (!obj) return new Date();

    const updatedDate = new Date(currentDate);

    if ('hours' in obj) {
        updatedDate.setHours(currentDate.getHours() + obj.hours);
    }

    if ('minutes' in obj) {
        updatedDate.setMinutes(currentDate.getMinutes() + obj.minutes);
    }

    if ('days' in obj) {
        updatedDate.setDate(currentDate.getDate() + obj.days);
    }

    return updatedDate;
}

function findApiKey() {

    return (
        process.env.X_TKN_API_KEY_ID ||
        process.env.REACT_APP_X_TKN_API_KEY_ID ||
        process.env.VUE_APP_X_TKN_API_KEY_ID ||
        ''
    )
}