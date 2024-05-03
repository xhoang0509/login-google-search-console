const { GoogleAccount } = require("../auto/gmail");
const config = require("../config");

module.exports = {
    login: async () => {
        const googleAccount = new GoogleAccount(
            config.googleAccount.email,
            config.googleAccount.password,
        );
        await googleAccount.init()
        await googleAccount.login(); 
        await googleAccount.close()
    },
};
