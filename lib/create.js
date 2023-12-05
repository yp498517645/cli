const fs = require("fs-extra");
const inquirer = require("inquirer");
const Generator = require("generator");
// 对外抛出一个方法用来接受用户要创建的文件项目名以及参数
module.exports = async function (name, options) {
  //判断项目是否存在
  const cwd = process.cwd();
  const targetAir = path.join(cwd, name);
  //目录是否存在
  if (fs.existsSync(targetAir)) {
    //是否强制创建
    if (options.force) {
      await fs.remove(targetAir);
    } else {
      //询问用户是否确定要覆盖
      try {
        const { action } = await inquirer.prompt([
          {
            name: "action",
            type: "list",
            message: "Target directory already exists",
            choices: [
              { name: "OverWrite", value: "overwrite" },
              {
                name: "Cancel",
                value: false,
              },
            ],
          },
        ]);
        if (!action) {
          return;
        } else {
          await fs.remove(targetAir);
        }
      } catch (error) {
        console.error(error);
      }
      //如果用户拒绝覆盖则停止操作
    }
  }

  //新建模板
  const generator = new Generator(name, targetAir);
  generator.create();
};
