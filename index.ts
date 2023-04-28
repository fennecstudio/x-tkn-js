import * as https from 'https';
import {IToken, ITokenInput} from "./types";

let API_URL = 'https://api.x-tkn.com'
let API_KEY_ID = findApiKey()

export async function setup(apiKeyId?: string) {

    if (apiKeyId) API_URL = apiKeyId;
}

export async function createSecurityToken(refId?: string, ttl: any = {hours: 2}, payload?: any): Promise<IToken> {

    let props = {
        type: 'security',
        refId,
        payload,
        expiresAt: addToDate(ttl),
        maxUses: 1
    }

    return await post(`/tokens/create`, props)
}

export async function createSessionToken(refId?: string, ttl: any = {hours: 2}, payload?: any, type: string = 'session'): Promise<IToken> {

    let props = {
        type,
        refId,
        payload,
        expiresAt: addToDate(ttl)
    }

    return await post(`/tokens/create`, props)
}

export async function createShortCode(refId?: string, ttl: any = {hours: 2}, payload?: any): Promise<IToken> {

    let props = {
        type: 'short-code',
        refId,
        payload,
        expiresAt: addToDate(ttl),
        shortCode: true
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

export async function redeemToken(tokenId: string, shortCode?: string): Promise<IToken | null> {

    let data = {} as any
    if (shortCode) data.shortCode = shortCode

    return await patch(`/tokens/${tokenId}/redeem`, data)
}

export async function revokeToken(tokenId: string): Promise<IToken | null> {

    return await patch(`/tokens/${tokenId}/revoke`)
}

export async function revokeTokens(where: any): Promise<any> {

    if (!where) return []

    return await patch(`/tokens/revoke`, where)
}

export async function updateToken(tokenId: string, updates = {}): Promise<IToken | null> {

    return await patch(`/tokens/${tokenId}/update`, updates)
}

// helpers

async function del(url: string) {
    try {
        let {data} = await request('DELETE', `${API_URL}${url}`)
        return sanitize(data);
    } catch (err) {
        handleError(err)
    }
}

async function get(url: string) {
    try {
        let {data} = await request('GET', `${API_URL}${url}`)
        return sanitize(data);
    } catch (err) {
        handleError(err)
    }
}

async function patch(url: string, props?: unknown) {
    try {
        let {data} = await request('PATCH', `${API_URL}${url}`, props)
        return sanitize(data);
    } catch (err) {
        handleError(err)
    }
}

async function post(url: string, props?: unknown) {
    try {
        let {data} = await request('POST', `${API_URL}${url}`, props)
        return sanitize(data);
    } catch (err) {
        handleError(err)
    }
}

function request(method: string, url: string, data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const postData = data && JSON.stringify(data);
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname,
            method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData?.length || 0,
                'Authorization': API_KEY_ID
            },
        };
        const req = https.request(options, (res) => {
            res.setEncoding('utf8');
            let responseBody = '';
            res.on('data', (chunk) => responseBody += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    data: parseJSON(responseBody),
                });
            });
        });
        req.on('error', (err) => reject(err));
        if (postData) req.write(postData);
        req.end();
    });
}

function sanitize(data?: any) {

    if (!data) return null;
    return data;
}

function parseJSON(input: any) {
    try {
        return isJSON(input) ? JSON.parse(input) : input;
    } catch (err) {
        return input
    }
}

function isJSON(str: any) {
    if (!str) return false
    if (typeof str !== 'string') return false
    const firstChar = str.charAt(0);
    const lastChar = str.charAt(str.length - 1);
    return (
        (firstChar === '{' && lastChar === '}') ||
        (firstChar === '[' && lastChar === ']')
    );
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