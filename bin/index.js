#!/usr/bin/env node
const program = require("commander");

//定义命令和参数
//create 命令
program
  .command("create <app-name>")
  .description("create a new project")
  .option("-f, --force", "overwrite target directory if it exits")
  .action((name, options) => {
    //打印结果
    console.log("program name is ", name);
  });

// 解析用户执行命令的传入参数
program.parse(process.argv);
