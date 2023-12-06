const downloadGitRepo = require("download-git-repo");
const util = require("util");
const path = require("path");
const http = require("./http");
// const cookie = require("tough-cookie");
// const cookieJar = new cookie.CookieJar();
// cookieJar.setCookie(
//   "_gitlab_session=0df3eed26b590215c04c52246ec65588",
//   "gitlab.yunext.com"
// );
// cookieJar.setCookie(
//   "remember_user_token=eyJfcmFpbHMiOnsibWVzc2FnZSI6Ilcxc3hNamhkTENJa01tRWtNVEFrTlZONWRHTXVVM0ZsUWpOU1JHcE9RM0pLY1RWcUxpSXNJakUzTURFNE5EWTNNRFl1TmpRNU1UVXlPQ0pkIiwiZXhwIjoiMjAyMy0xMi0yMFQwNzoxMTo0Ni42NDlaIiwicHVyIjpudWxsfX0%3D--54f201a1935489c4563d5e0bdb2f6c34e0218cd3",
//   "gitlab.yunext.com"
// );
// cookieJar.setCookie(
//   "experimentation_subject_id=IjQ4MDU1ZWQwLTkxMzAtNDU0YS1iNmYwLTRmMGEyNzg4M2E0YiI%3D--0560db9bafbdde458369719710b1eb4d36a6c799",
//   ".yunext.com"
// );
//loading外壳
async function wrapLoading(fn, message, ...args) {
  let spinner;
  try {
    console.log("--fn--", fn);
    spinner = (await import("ora")).default(message).start();
    const result = await fn(...args);
    spinner && spinner.succeed();
    return result;
  } catch (error) {
    spinner && spinner.fail("request failed,please refetch...");
  }
}

class Generator {
  constructor(name, targetDir) {
    this.name = name;
    this.targetDir = targetDir;
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  //用户选择的模板
  //1.远程模板
  //2.本地模板
  //3.返回用户选择的模板
  async getRepo() {
    const repoList = await wrapLoading(
      http.getRepoList,
      "waiting for fetch template"
    );
    if (!repoList) {
      return;
    }
    const repos = repoList.map((item) => {
      return { name: item.name, value: item.name };
    });
    //让用户去选择自己新下载的模板名称
    const inquirer = await import("@inquirer/prompts");
    const repo = await inquirer.select({
      type: "list",
      message: "Please choose a template to create project",
      choices: repos,
    });
    return repo;
  }

  //用户版本选择
  //1.基于repo的结果，远程拉版本列表
  async getTag(repo) {
    const tags = await wrapLoading(
      http.getTagList,
      "waiting for fetch template",
      repo
    );
    if (!tags) return;
    const tagsList = tags.map((item) => item.name);
    return tagsList[0];
  }

  /**
   * 下载模板
   * @param {any} repo 仓库
   * @param {any} tag 版本
   * @returns {any}
   */
  async download(repo, tag) {
    const requestUrl = `FEcourseZone/${repo}${tag ? "#" + tag : ""}`;
    console.log("--requestUrl--", requestUrl);
    await wrapLoading(
      downloadGitRepo,
      "waiting download template",
      "direct:https://gitlab.yunext.com/root/snowflake-web-front.git",
      "test",
      {
        output: path.resolve(process.cwd(), this.targetDir),
        clone: true,
      },
      (err) => {
        return console.log("--err--", err);
      }
    );
  }

  /**
   * 核心创建逻辑
   * @returns {any}
   */
  async create() {
    //获取模板名称
    const repo = await this.getRepo();
    //获取tag
    const tag = await this.getTag(repo);
    //下载模板到目录
    await this.download(repo, tag);
  }
}

module.exports = Generator;
