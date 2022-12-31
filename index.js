let axios = require("axios");

let API_URL = 'https://api.toknize.io';
let API_KEY = null;

module.exports.setup = function (apiKey, apiUrl) {
    API_KEY = apiKey;
    if (apiUrl) API_URL = apiUrl;
}

module.exports.createToken = async function (props) {

    return await post(`/tokens/create`, props)
}

module.exports.deleteToken = async function (tokenId) {

    return await del(`/tokens/${tokenId}`)
}

module.exports.readToken = async function (tokenId) {

    return await get(`/tokens/${tokenId}/read`)
}

module.exports.redeemToken = async function (tokenId) {

    return await patch(`/tokens/${tokenId}/redeem`)
}

module.exports.revokeToken = async function (tokenId) {

    return await patch(`/tokens/${tokenId}/revoke`)
}

// helpers

async function del(url) {
    try {
        let {data} = await axios.delete(`${API_URL}${url}`, config())

        return data;

    } catch (err) {

        handleError(err)
    }
}

async function get(url) {
    try {
        let {data} = await axios.get(`${API_URL}${url}`, config())

        return data;

    } catch (err) {

        handleError(err)
    }
}

async function patch(url, props) {
    try {
        let {data} = await axios.patch(`${API_URL}${url}`, props, config())

        return data;

    } catch (err) {

        handleError(err)
    }
}

async function post(url, props) {
    try {
        let {data} = await axios.post(`${API_URL}${url}`, props, config())

        return data;

    } catch (err) {

        handleError(err)
    }
}

function config() {
    return {headers: {authorization: API_KEY}}
}

function handleError(err) {

    // console.error(err)

    if (err?.response) {

        let {data} = err?.response || {};

        throw Error(data)
    }
}