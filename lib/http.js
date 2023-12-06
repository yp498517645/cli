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
  const result = axios.get("https://api.github.com/orgs/FEcourseZone/repos");
  return result;
}

/**
 * 获取版本信息
 * @param {any} repo 仓库
 * @returns {any}
 */
async function getTagList(repo) {
  return axios.get("https://api.github.com/orgs/FEcourseZone/repos");
}

module.exports = {
  getRepoList,
  getTagList,
};
