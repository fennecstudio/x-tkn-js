"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let axios = require("axios");
let API_URL = 'https://api.toknize.io';
let API_KEY = '';
module.exports.setup = function (apiKey, options = {}) {
    API_KEY = apiKey;
    if (options === null || options === void 0 ? void 0 : options.apiUrl)
        API_URL = options.apiUrl;
};
module.exports.createToken = function (props) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield post(`/tokens/create`, props);
    });
};
module.exports.deleteToken = function (tokenId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield del(`/tokens/${tokenId}`);
    });
};
module.exports.readToken = function (tokenId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield get(`/tokens/${tokenId}/read`);
    });
};
module.exports.redeemToken = function (tokenId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield patch(`/tokens/${tokenId}/redeem`);
    });
};
module.exports.revokeToken = function (tokenId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield patch(`/tokens/${tokenId}/revoke`);
    });
};
// helpers
function del(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { data } = yield axios.delete(`${API_URL}${url}`, config());
            return data;
        }
        catch (err) {
            handleError(err);
        }
    });
}
function get(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { data } = yield axios.get(`${API_URL}${url}`, config());
            return data;
        }
        catch (err) {
            handleError(err);
        }
    });
}
function patch(url, props) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { data } = yield axios.patch(`${API_URL}${url}`, props, config());
            return data;
        }
        catch (err) {
            handleError(err);
        }
    });
}
function post(url, props) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { data } = yield axios.post(`${API_URL}${url}`, props, config());
            return data;
        }
        catch (err) {
            handleError(err);
        }
    });
}
function config() {
    return { headers: { authorization: API_KEY } };
}
function handleError(err) {
    // console.error(err)
    if (err === null || err === void 0 ? void 0 : err.response) {
        let { data } = (err === null || err === void 0 ? void 0 : err.response) || {};
        throw Error(data);
    }
}
