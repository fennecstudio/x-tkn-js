let axios = require("axios");

let API_URL = process.env.TOKNIZE_API_URL || process.env.REACT_APP_TOKNIZE_API_URL || process.env.VUE_APP_TOKNIZE_API_URL || 'https://api.toknize.io'
let API_KEY_ID = process.env.TOKNIZE_API_KEY_ID || process.env.REACT_APP_TOKNIZE_API_KEY_ID || process.env.VUE_APP_TOKNIZE_API_KEY_ID || ''

module.exports.toknize = function (options: IToknizeOptions = {}) {

    if (options.apiUrl) API_URL = options.apiUrl;
    if (options.apiKeyId) API_KEY_ID = options.apiKeyId;
}

module.exports.createToken = async function (props: unknown) {

    return await post(`/tokens/create`, props)
}

module.exports.deleteToken = async function (tokenId: string) {

    return await del(`/tokens/${tokenId}`)
}

module.exports.readToken = async function (tokenId: string) {

    return await get(`/tokens/${tokenId}/read`)
}

module.exports.redeemToken = async function (tokenId: string) {

    return await patch(`/tokens/${tokenId}/redeem`)
}

module.exports.revokeToken = async function (tokenId: string) {

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

interface IToknizeOptions {
    apiKeyId?: string,
    apiUrl?: string,
}