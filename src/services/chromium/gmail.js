const { GoogleAutomation } = require("../../auto/googleAutomation");
const { googleAccount } = require("../../config");

module.exports = {
    login: async () => {
        const ggGmail = new GoogleAutomation({
            email: googleAccount.email,
            password: googleAccount.password,
        });
        await ggGmail.init();
        const status = await ggGmail.login();
        await ggGmail.close();
        return status;
    },
    checkLogin: async () => {
        const ggGmail = new GoogleAutomation({
            email: googleAccount.email,
            password: googleAccount.password,
        });
        await ggGmail.init();
        const status = await ggGmail.checkLogin();
        await ggGmail.close();
        return status;
    },
};
