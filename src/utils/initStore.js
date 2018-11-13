import mergeObservables from 'utils/mobxMergeObservables'

/**
 * 将后端给的初始数据与mobx模型合并
 * @param {Object} store store模型
 *
 * @return {Store} 合并好的初始store
 */
function initStore(store) {
  const source = window.__INITIAL_STATE__

  return mergeObservables(store, source)
}

export default initStore
