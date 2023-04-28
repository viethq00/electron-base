const axios = require("axios");

module.exports = {
  classname: "configAxios",
  callApi: async (method, url, data, options) => {
    if (options.length == 0) {
      const response = await axios({
        url: url,
        method: method,
        data: data,
      });
      return response;
    }

    const response = await axios({
      url: url,
      method: method,
      data: data,
      headers: options,
    });
    return response;
  },
};
