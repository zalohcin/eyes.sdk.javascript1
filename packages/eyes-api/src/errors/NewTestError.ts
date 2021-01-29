import TestFailedError from './TestFailedError'
import {TestResults} from '../output/TestResults'

export default class NewTestError extends TestFailedError {
  constructor(message: string, testResults: TestResults) {
    super(message, testResults)
  }
}
