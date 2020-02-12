'use strict'

const assert = require('assert')
const {
  GeneralUtils: {sleep},
} = require('@applitools/eyes-common')
const {FakeEyes} = require('../testUtils')
const {EyesBase, Configuration, RunningSession} = require('../../index')

describe('EyesBase', () => {
  let eyes
  describe('getAndSetBatchInfo()', () => {
    beforeEach(() => {
      eyes = new EyesBase()
      eyes._getAndSaveScmMergeBaseTime = async _parentBranchName =>
        `some-datetime-of-${_parentBranchName}`
      eyes._getAndSaveBatchInfoFromServer = async batchId => ({
        ScmSourceBranch: `barnch-name-of-${batchId}`,
        ScmTargetBranch: `parent-barnch-name-of-${batchId}`,
      })

      process.env.APPLITOOLS_BRANCH = null
      process.env.APPLITOOLS_PARENT_BRANCH = null
      process.env.APPLITOOLS_BATCH_ID = null
    })

    it('should return batch info on local branch test', async () => {
      const configuration = new Configuration({
        branchName: 'some-feature',
        parentBranchName: 'master-branch',
      })
      eyes.setConfiguration(configuration)
      const result = await eyes.getAndSetBatchInfo()

      const expected = {
        branchName: 'some-feature',
        parentBranchName: 'master-branch',
        parentBranchBaselineSavedBefore: 'some-datetime-of-master-branch',
      }
      assert.deepStrictEqual(result, expected)
    })

    it('should return batch info on local branch test with env variables', async () => {
      process.env.APPLITOOLS_BRANCH = 'some-feature'
      process.env.APPLITOOLS_PARENT_BRANCH = 'master-branch'
      const result = await eyes.getAndSetBatchInfo()

      const expected = {
        branchName: 'some-feature',
        parentBranchName: 'master-branch',
        parentBranchBaselineSavedBefore: 'some-datetime-of-master-branch',
      }
      assert.deepStrictEqual(result, expected)
    })

    it('should return batch info on ci branch test', async () => {
      eyes.setBatch('batch-name', 'some-batch-id')
      const result = await eyes.getAndSetBatchInfo()

      const expected = {
        branchName: 'barnch-name-of-some-batch-id',
        parentBranchName: 'parent-barnch-name-of-some-batch-id',
        parentBranchBaselineSavedBefore: 'some-datetime-of-parent-barnch-name-of-some-batch-id',
      }
      assert.deepStrictEqual(result, expected)
    })

    it('should return batch info on ci branch test with env variables', async () => {
      process.env.APPLITOOLS_BATCH_ID = 'some-batch-id'
      const result = await eyes.getAndSetBatchInfo()

      const expected = {
        branchName: 'barnch-name-of-some-batch-id',
        parentBranchName: 'parent-barnch-name-of-some-batch-id',
        parentBranchBaselineSavedBefore: 'some-datetime-of-parent-barnch-name-of-some-batch-id',
      }
      assert.deepStrictEqual(result, expected)
    })

    it('should return batch info with no scm data on same branch test', async () => {
      const configuration = new Configuration({
        branchName: 'some-feature',
        parentBranchName: 'some-feature',
      })
      eyes.setConfiguration(configuration)
      const result = await eyes.getAndSetBatchInfo()

      const expected = {
        branchName: 'some-feature',
        parentBranchName: 'some-feature',
        parentBranchBaselineSavedBefore: undefined,
      }
      assert.deepStrictEqual(result, expected)
    })

    it('should return batch info on local branch test with batcn id', async () => {
      const configuration = new Configuration({
        branchName: 'some-feature',
        parentBranchName: 'master-branch',
      })
      eyes.setConfiguration(configuration)
      eyes.setBatch('batch-name', 'BID')
      const result = await eyes.getAndSetBatchInfo()

      const expected = {
        branchName: 'some-feature',
        parentBranchName: 'master-branch',
        parentBranchBaselineSavedBefore: 'some-datetime-of-master-branch',
      }
      assert.deepStrictEqual(result, expected)
    })
  })

  describe('startSession()', () => {
    let startSessionArgs

    beforeEach(async () => {
      eyes = new FakeEyes()
      eyes.getAndSetBatchInfo = async () => {
        await sleep(10)
        return {
          branchName: 'some-feature',
          parentBranchName: 'master-branch',
          parentBranchBaselineSavedBefore: 'some-datetime',
        }
      }
      const rs = new RunningSession()
      eyes._serverConnector = {startSession: async args => ((startSessionArgs = args), rs)}
      await eyes.openBase('appName', 'testName')
    })

    it('should set SessionStartInfo with batch info', async () => {
      await eyes.startSession()

      assert.strictEqual(startSessionArgs.getBranchName(), 'some-feature')
      assert.strictEqual(startSessionArgs.getParentBranchName(), 'master-branch')
      assert.strictEqual(startSessionArgs.getParentBranchBaselineSavedBefore(), 'some-datetime')
    })
  })
})
