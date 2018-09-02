'use strict';

function createResourceCache() {
  function getOrInit(key) {
    return cache[key] || (cache[key] = {});
  }

  function getValue(key) {
    const entry = cache[key];
    return entry ? entry.value : null;
  }

  function setValue(key, value) {
    const entry = getOrInit(key);
    entry.value = value;
    return value;
  }

  function setDependencies(key, dependencies) {
    const entry = getOrInit(key);
    entry.dependencies = dependencies;
  }

  function getWithDependencies(key) {
    const entry = cache[key];
    if (!entry || !entry.value) return;

    const ret = {};
    ret[key] = entry.value;
    if (entry.dependencies) {
      entry.dependencies.forEach(dep => {
        Object.assign(ret, getWithDependencies(dep));
      });
    }
    return ret;
  }

  function remove(key) {
    delete cache[key];
  }

  const cache = {};

  return {
    getValue,
    setValue,
    setDependencies,
    getWithDependencies,
    remove,
  };
}

module.exports = createResourceCache;
