const { PAYTM_MID, PAYTM_MERCHANT_KEY, PAYTM_MERCHANT_WEBSITE, CALLBACK_URL} = process.env;
exports.mid = PAYTM_MID;
exports.website = PAYTM_MERCHANT_WEBSITE;
exports.key = PAYTM_MERCHANT_KEY;
exports.callback = CALLBACK_URL;