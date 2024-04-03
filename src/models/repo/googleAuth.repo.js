const { LTAP_GOOGLE_AUTH_KEY } = require("../../constants");
const googleAuthModel = require("../index").googleAuth;

module.exports = {
    findGoogleAuth: () => googleAuthModel.findOne({ where: { key: LTAP_GOOGLE_AUTH_KEY } }),
    updateGoogleAuth: (data) =>
        googleAuthModel.update(data, {
            where: {
                key: LTAP_GOOGLE_AUTH_KEY,
            },
        }),
};
