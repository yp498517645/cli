const downloadGitRepo = require("download-git-repo");
const util = require("util");
const ora = require("ora"); //terminal 旋转
const http = require("./http");
const inquirer = require("inquirer"); //模板选择

class Generator {
  constructor(name, targetDir) {
    this.name = name;
    this.targetDir = targetDir;
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  //loading外壳
  async wrapLoading(fn, message, ...args) {
    const spinner = ora(message);
    spinner.start();
    try {
      const result = await fn(...args);
      spinner.succeed();
      return result;
    } catch (error) {
      spinner.fail("request failed,please refetch...");
    }
  }

  //用户选择的模板
  //1.远程模板
  //2.本地模板
  //3.返回用户选择的模板
  async getRepo() {
    const repoList = wrapLoading(
      http.getRepoList,
      "waiting for fetch template"
    );
    if (!repoList) {
      return;
    }
    const repos = repoList.map((item) => {
      return item.name;
    });

    //让用户去选择自己新下载的模板名称
    const { repo } = await inquirer.prompt([
      {
        name: "repo",
        type: "list",
        message: "Please choose a template to create project",
        choices: repos,
      },
    ]);
    return repo;
  }
}
