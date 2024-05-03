const {
    PORT,
    AMQP_URI,
    CHROME_PROFILE_PATH,
    GMAIL_EMAIL,
    GMAIL_PASSWORD,
    GG_CLIENT_ID,
    GG_CLIENT_SECRET,
} = process.env;

module.exports = {
    app: {
        port: PORT,
        amqp_uri: `amqp://${AMQP_URI}`,
    },
    chromium: {
        path: CHROME_PROFILE_PATH,
    },
    googleAccount: {
        email: GMAIL_EMAIL,
        password: GMAIL_PASSWORD,
    },
    googleApi: {
        clientId: GG_CLIENT_ID,
        clientSecret: GG_CLIENT_SECRET,
        redirectUrl: `http://localhost:${PORT}/google-auth/callback`,
    },
};
