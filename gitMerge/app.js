const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const app = express();
const port = 3001;

app.use(bodyParser.json());

// 假设仓库路径存储在一个数组中
const repositories = [
  { name: 'm', path: 'D:\\/execProjects\\/plus-ops-frontend' },
  { name: 'on', path: '/path/to/repo2' },
  { name: 'sc', path: '/path/to/repo3' },
  { name: 'shared', path: '/path/to/repo4' }
];

// 根据仓库名获取仓库路径
const getRepositoryPath = (repoName) => {
  const repo = repositories.find(r => r.name === repoName);
  return repo ? repo.path : null;
};

const _targetBranch = 'feature/SP55/t2/test';

// API to create and checkout a new branch
app.post('/create-branch', (req, res) => {
  const { repoName, branchName, targetBranch= _targetBranch } = req.body;
  // const branchName = `merge/SP${sprint}/t2/sit`
  const repoPath = getRepositoryPath(repoName);
  if (!repoPath) {
    return res.status(404).send({ message: `Repository not found: ${repoName}` });
  }

  // pull targetBranch
  const pullTargetBranchCommand = `git -C ${repoPath} pull origin ${targetBranch}`;
  const checkoutTargetBranchCommand = `git -C ${repoPath} checkout ${targetBranch}`;


  exec(`git -C ${repoPath} checkout -b ${branchName} && git -C ${repoPath} pull origin ${targetBranch}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send({ message: `Error creating branch: ${stderr}` });
    }
    res.send({ message: `Branch created and checked out for ${repoName}: ${stdout}` });
  });
});

// API to pull remote code regularly
app.post('/pull-remote', (req, res) => {
  const { repoName } = req.body;
  const repoPath = getRepositoryPath(repoName);
  if (!repoPath) {
    return res.status(404).send({ message: `Repository not found: ${repoName}` });
  }

  exec(`git -C ${repoPath} pull origin ${targetBranch}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send({ message: `Error pulling remote: ${stderr}` });
    }
    res.send({ message: `Remote code pulled for ${repoName}: ${stdout}` });
  });
});

// API to merge a branch into targetBranch
app.post('/merge-branch', (req, res) => {
  const { repoName, sourceBranch , targetBranch } = req.body;
  const repoPath = getRepositoryPath(repoName);
  if (!repoPath) {
    return res.status(404).send({ message: `Repository not found: ${repoName}` });
  }
  const fetchCommand = `git -C ${repoPath} fetch origin`;
  const pullTargetBranchCommand = `git -C ${repoPath} pull origin ${targetBranch}`;
  const pullSourceBranchCommand = `git -C ${repoPath} pull origin ${sourceBranch}`;
  const mergeBranchCommand = `git -C ${repoPath} merge ${sourceBranch} ${targetBranch}`;
  const pushBranchCommand = `git -C ${repoPath} push origin ${targetBranch}`;

  exec(`${fetchCommand} && ${pullTargetBranchCommand} && ${pullSourceBranchCommand} && ${mergeBranchCommand} && ${pushBranchCommand}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send({ message: `Error merging branch: ${stderr}` });
    }
    res.send({ message: `Branch merged for ${repoName}: ${stdout}` });
  });
});

// push 分支
app.post('/push-branch', (req, res) => {
  const { repoName, branchName } = req.body;
  const repoPath = getRepositoryPath(repoName);
  if (!repoPath) {
    return res.status(404).send({ message: `Repository not found: ${repoName}` });
  }

  exec(`git -C ${repoPath} push origin ${branchName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send({ message: `Error pushing branch: ${stderr}` });
    }
    res.send({ message: `Branch pushed for ${repoName}: ${stdout}` });
  });
});

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
// 监听变化, 有变化则自动重启
