#!/usr/bin/env node
/**
 * 以上code，
 * mac下有效，声明当前文件 使用哪种解析器
 * win下无效，win自动根据文件类型调用解析器
 */

const shelljs = require('shelljs');
const spawn = require('../cli-shared-utils/spawn');
// 交互模块
const inquirer = require('inquirer');
// 文件模块
const { textRedBright, textCyan } = require('../cli-shared-utils/chalk');
const { gitBranchCurrent } = require('../cli-shared-utils/git');

const { cacheProjectsValid } = require('../cli-shared-utils/cache');

(async () => {
  const { inputVal } = await inquirer.prompt([{
    type: 'list',
    message: 'Which do you want to start',
    name: 'inputVal',
    choices: [].map.call(cacheProjectsValid(), i => i.localPath),
    pageSize: 2
  }]);

  // current git branch
  const res = await gitBranchCurrent(inputVal);
  if (res.code !== 0) throw res.stderr;

  const { inputConfirm } = await inquirer.prompt([{
    type: 'confirm',
    message: 'Are u sure the branch: ' + textRedBright(res.stdout),
    name: 'inputConfirm'
  }]);

  if (!inputConfirm) return shelljs.exit(1);

  spawn('npm start', inputVal);
  // end
})();
