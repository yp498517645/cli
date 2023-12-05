const axios = require("axios");
axios.interceptors.response.use((res) => {
  return res.data;
});

/**
 * 获取模板列表
 * @param {any} params
 * @returns {any}
 */
async function getRepoList(params) {
  return axios.get("https://api.github.com/orgs/FEcourseZone/repos");
}

module.exports = {
  getRepoList,
};
