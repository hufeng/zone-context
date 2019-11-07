const async_hooks = require('async_hooks');

const contexts = {};

// enable async_hooks
async_hooks
  .createHook({
    init(asyncId, type, triggerAsyncId, resource) {
      process._rawDebug(asyncId, type, triggerAsyncId);
      if (contexts[triggerAsyncId]) {
        contexts[asyncId] = triggerAsyncId;
      }
    }
  })
  .enable();

async function ZoneContext(fn) {
  let rootId;
  const asyncResource = new async_hooks.AsyncResource('ZoneContext');
  // 解决非异步函数会发生覆盖context的问题
  await asyncResource.runInAsyncScope(async () => {
    rootId = async_hooks.executionAsyncId();
    contexts[rootId] = {};
    await fn();
  });
  // 删除调用树
  destroy(rootId);
  console.log('last=>', contexts);
}

function getContext(key) {
  const asyncId = async_hooks.executionAsyncId();
  const root = findRootVal(asyncId);
  return root && root[key];
}

function setContext(param = {}) {
  const curId = async_hooks.executionAsyncId();
  const root = findRootVal(curId);
  if (root) {
    merge(root, param);
  }
}

function findRootVal(asyncId) {
  let parent = contexts[asyncId];
  // root
  if (typeof parent === 'object') {
    return parent;
  }

  // 寻找root
  while (typeof parent !== 'object' && typeof parent !== 'undefined') {
    parent = contexts[parent];
  }

  return parent;
}

function destroy(rootId) {
  delete contexts[rootId];

  const ids = [];
  // 寻找下级节点
  for (let [id, pid] of Object.entries(contexts)) {
    if (pid == rootId) {
      ids.push(id);
    }
  }

  for (let id of ids) {
    destroy(id);
  }
}

function merge(src, other) {
  for (let key of Object.keys(other)) {
    src[key] = other[key];
  }
}

module.exports = {
  ZoneContext,
  getContext,
  setContext
};
