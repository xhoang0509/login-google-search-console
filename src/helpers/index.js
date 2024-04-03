exports.sleep = async (time) => {
    await new Promise((res) => setTimeout(res, time));
};

exports.convertShopifyDomainToSiteUrl = (shopifyDomain) => {
    return `https://${shopifyDomain}/`
}

/**
 *
 * @param siteUrl For example: http://www.example.com
 */
exports.checkSiteUrl = (siteUrl) => {
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlRegex.test(siteUrl)
}