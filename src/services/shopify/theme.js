const API_VERSION = "2022-10";

const baseShopifyParams = ({ accessToken, method }) => {
    return {
        method: method,
        headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
        },
        body: null,
    };
};

const getContentFile = async ({ domain, accessToken, themeId, key }) => {
    try {
        const params = baseShopifyParams({ accessToken, method: "GET" });
        const url = `https://${domain}/admin/api/${API_VERSION}/themes/${themeId}/assets.json?asset[key]=${key}`;
        const res = await fetch(url, params);
        if (res && res.status === 200) {
            const resJson = await res.json();
            return resJson.asset.value;
        } else {
            console.log("fetch file content failed!");
            return null;
        }
    } catch (e) {
        console.log("fetch file content error: ", e);
        return null;
    }
};

const pushContentFile = async ({ domain, accessToken, themeId, fileContent, fileName }) => {
    try {
        const params = baseShopifyParams({ accessToken, method: "PUT" });
        params.body = JSON.stringify({
            asset: {
                key: fileName,
                value: fileContent,
            },
        });
        const url = `https://${domain}/admin/api/${API_VERSION}/themes/${themeId}/assets.json`;
        const res = await fetch(url, params);
        const resJson = await res.json();
        return resJson;
    } catch (e) {
        console.log("push content file error: ", e);
    }
};

module.exports = {
    getContentFile,
    pushContentFile,
};
