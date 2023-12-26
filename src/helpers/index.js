exports.sleep = async (time) => {
    await new Promise((res) => setTimeout(res, time));
};
