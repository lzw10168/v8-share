const { execSync } = require('child_process');
const minimist = require('minimist');


const path = 'C:\\Users\\zhiwei.li\\Desktop\\shared-ops-frontend';

// 获取指定天数前的日期
function getDateString(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

// 获取远程分支
function getRemoteBranches() {
  const output = execSync('git branch -r', { encoding: 'utf8' }).trim();
  return output.split('\n').map((branch) => branch.trim())
  // .filter((branch) => !branch.includes('plus-ops-frontend'));
}

// 获取本地分支
function getLocalBranches() {
  const output = execSync('git branch -vv', { encoding: 'utf8' }).trim();
  return output.split('\n').map((line) => line.trim());
}

// 获取标签
function getTags() {
  const output = execSync('git tag', { encoding: 'utf8' }).trim();
  return output.split('\n').map((tag) => tag.trim());
}

// fetch 清除缓存
function fetchPrune() {
  execSync('git fetch --prune', { encoding: 'utf8' });
}

// 筛选出几个月前的分支
function filterBranches(branches, daysAgo) {
  const cutoffDate = getDateString(daysAgo);
  const result = [];

  branches.forEach((branch) => {
    let branchName;
    if (branch.includes('->')) {
      return;
    }
    branchName = branch;
    if (branch.startsWith('origin/')) {
      branchName = branch; // 远程分支
    } else {
      branchName = branch.split(' ')[0]; // 本地分支
    }
    // console.log('branchName: ', branchName);

    if (!branchName) return;

    // 获取最后一次提交的时间
    const commitDateOutput = execSync(`git show -s --format=%ci "${branchName}"`, {
      encoding: 'utf8',
    }).trim();
    const commitDate = commitDateOutput.split(' ')[0];

    if (commitDate < cutoffDate) {
      result.push(branchName);
    }
  });

  return result;
}

// filterTags
function filterTags(tags, daysAgo) {
  const cutoffDate = getDateString(daysAgo);
  const result = [];

  tags.forEach((tag) => {
    // 获取标签的时间
    const commitDateOutput = execSync(`git show -s --format=%ci "${tag}"`, {
      encoding: 'utf8',
    }).trim();
    const commitDate = commitDateOutput.split(' ')[0];

    if (commitDate < cutoffDate) {
      result.push(tag);
    }
  });

  return result;
}

// 删除标签
function deleteTags(tagList) {
  if (tagList.length === 0) return;

  // 分组删除
  const groupSize = 30;
  const groupCount = Math.ceil(tagList.length / groupSize);
  for (let i = 0; i < groupCount; i++) {
    const start = i * groupSize;
    const end = (i + 1) * groupSize;
    const group = tagList.slice(start, end);
    console.log(`删除标签：${group.join(', ')}`);
    try {
      execSync(`git tag -d ${group.join(' ')}`, { stdio: 'inherit' }); // 删除本地标签
      console.log('本地标签删除成功');
      execSync(`git push origin --delete ${group.join(' ')}`, { stdio: 'inherit' }); // 删除远程标签
      console.log('远程标签删除成功');
    } catch (error) {
      console.error('删除标签时出错:', error.message);
    }
  }
}
const groupSize = 60;

function deleteRemoteBranches(_branchList) {
  let branchList = _branchList;
  if (!Array.isArray(branchList) || branchList.length === 0) {
    console.log('删除远程分支时出错：分支列表为空');
    return;
  }
  branchList = branchList.filter(
    (branch) =>
      !['origin/master', 'origin/sit', 'origin/uat', 'origin/prod', 'origin/develop'].includes(
        branch,
      ),
  );
  branchList = branchList.map((branch) => branch.replace('origin/', ''));
  let hasSpecialSymbolBranchList = branchList.filter((branch) => branch.includes('&'));
  let noSpecialSymbolBranchList = branchList.filter((branch) => !branch.includes('&'));

  // 特殊符号分支删除
  console.log('首先删除特殊符号分支：');
  if (hasSpecialSymbolBranchList.length > 0) {
    hasSpecialSymbolBranchList.forEach((branch) => {
      console.log(`删除远程分支：${branch}`);
      try {
        execSync(`git push origin --delete ${branch}`, { stdio: 'inherit' });
        console.log('远程分支删除成功');
      } catch (error) {
        console.error('删除远程分支时出错:', error.message);
      }
    });
  }

  // 分组删除
  const groupCount = Math.ceil(noSpecialSymbolBranchList.length / groupSize);
  for (let i = 0; i < groupCount; i++) {
    const start = i * groupSize;
    const end = (i + 1) * groupSize;
    const group = noSpecialSymbolBranchList.slice(start, end);
    console.log(`删除远程分支：${group.join(', ')}`);
    try {
      execSync(`git push origin --delete ${group.join(' ')}`, { stdio: 'inherit' });
      console.log('远程分支删除成功');
    } catch (error) {
      console.error('删除远程分支时出错:', error.message);
    }
  }
}

function deleteLocalBranches(branchList) {
  let hasSpecialSymbolBranchList = branchList.filter((branch) => branch.includes('&'));
  let noSpecialSymbolBranchList = branchList.filter((branch) => !branch.includes('&'));
   // 特殊符号分支删除
   console.log('首先删除特殊符号分支：');
   if (hasSpecialSymbolBranchList.length > 0) {
     hasSpecialSymbolBranchList.forEach((branch) => {
       console.log(`删除远程分支：${branch}`);
       try {
         execSync(`git branch -D "${branch.replace('&', '/&')}"`, { stdio: 'inherit',encoding: 'utf8' });
         console.log('远程分支删除成功');
       } catch (error) {
         console.error('删除远程分支时出错:', error.message);
       }
     });
   }
  // 分组删除
  const groupCount = Math.ceil(noSpecialSymbolBranchList.length / groupSize);
  for (let i = 0; i < groupCount; i++) {
    const start = i * groupSize;
    const end = (i + 1) * groupSize;
    const group = noSpecialSymbolBranchList.slice(start, end);
    console.log(`删除本地分支：${group.join(', ')}`);
    try {
      execSync(`git branch -D ${group.join(' ')}`, { stdio: 'inherit' });
      console.log('本地分支删除成功');
    } catch (error) {
      console.error('删除本地分支时出错:', error.message);
    }
  }

 
}

// 主函数
function main() {
  // inter the source code path
  process.chdir(path);
  console.log('=== Branch Cleanup Script ===');
  // fetchPrune();
  console.log('1. 正在获取远程分支...');
  const remoteBranches = getRemoteBranches();
  console.log('   远程分支获取完成');

  console.log('2. 正在获取本地分支...');
  const localBranches = getLocalBranches();
  console.log('   本地分支获取完成');

  // console.log('3. 正在获取标签...');
  // const tags = getTags();
  // console.log('   标签获取完成');

  // 过滤远程分支
  const daysAgo = 90; // 三个月
  console.log(`3. 筛选出 ${daysAgo} 天前的远程分支...`);
  console.log('remoteBranches: ', remoteBranches);
  const oldRemoteBranches = filterBranches(remoteBranches, daysAgo);
  console.log('   筛选完成');

  // 过滤本地分支
  console.log(`4. 筛选出 ${daysAgo} 天前的本地分支...`);
  const oldLocalBranches = filterBranches(localBranches, daysAgo);
  console.log('   筛选完成');

  // 过滤标签
  // console.log(`5. 筛选出 ${daysAgo} 天前的标签...`);
  // const oldTags = filterTags(tags, daysAgo);
  // console.log('   筛选完成');

  // console.log('以下标签将被删除：');
  // if (oldTags.length > 0) {
  //   console.log(`标签：${oldTags.join(', ')}`);
  // } else {
  //   console.log('没有需要删除的标签');
  // }

  console.log('以下分支将被删除：');
  if (oldRemoteBranches.length > 0) {
    console.log(`远程分支：${oldRemoteBranches.join(', ')}`);
  } else {
    console.log('没有需要删除的远程分支');
  }

  if (oldLocalBranches.length > 0) {
    console.log(`本地分支：${oldLocalBranches.join(', ')}`);
  } else {
    console.log('没有需要删除的本地分支');
  }

  const args = minimist(process.argv.slice(2));
  const dryRun = args['dry-run'] || args.dryRun;

  if (!dryRun) {
    console.log('\n开始执行删除操作...');
  } else {
    console.log('\n模拟删除操作（实际不删除分支）...');
  }

  // deleteTags(oldTags);
  deleteRemoteBranches(oldRemoteBranches);
  deleteLocalBranches(oldLocalBranches);

  console.log('\n清理完成，请运行 `git fetch --prune` 清理本地远程分支状态');
}

// 运行主函数
main()
