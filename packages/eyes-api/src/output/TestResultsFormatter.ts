import SessionUrls from './SessionUrls';
import StepInfo from './StepInfo';
import TestResults from './TestResults';


enum Statuses {
    OK = 'ok',
    NOT_OK = 'not ok'
}

export type TestResultsFormatter = {
    resultsList?: TestResults[]
}

type TotalTime = { totalTime?: number }

export default class TestResultsFormatterData implements Required<TestResultsFormatter> {
    private _resultsList: TestResults[];

    constructor(resultsList: TestResults[] = []) {
        this._resultsList = resultsList;
    }

    addTestResults(result: TestResults): TestResultsFormatterData {
        if (result) {
            this._resultsList.push(result)
        }

        return this;
    }
    /** 
    @deprecated use {@link #addTestResults(results)} instead
    */
    addResults(result: TestResults): TestResultsFormatterData {
        return this.addTestResults(result);
    }

    get resultsList(): TestResults[] {
        return this._resultsList;
    }

    set resultsList(results: TestResults[]) {
        this._resultsList = results;
    }

    getResultsList(): TestResults[] {
        return this._resultsList;
    }

    clearResultsList(): void {
        this._resultsList = [];
    }

    asFormatterString(includeSubTests: boolean = true, markNewAsPassed: boolean = false): string {
        if (this._resultsList.length === 0) {
            return 'No results found.'
        }

        let formattedString: string = '[EYES: TEST RESULTS]:\n'

        for (let i = 0; i < this._resultsList.length; i += 1) {
            const currentResult: TestResults = this._resultsList[i];
            const testTitle: string = `${currentResult.getName()} [${currentResult
                .getHostDisplaySize()
                .toString()}]`
            let testResult: string = ''

            if (currentResult.getIsNew()) {
                testResult = markNewAsPassed ? 'Passed' : 'New'
            } else if (currentResult.isPassed()) {
                testResult = 'Passed'
            } else {
                const stepsFailed = currentResult.getMismatches() + currentResult.getMissing()
                testResult = `Failed ${stepsFailed} of ${currentResult.getSteps()}`
            }

            formattedString += `${testTitle} - ${testResult}\n`

            if (includeSubTests) {
                if (currentResult.getStepsInfo().length > 0) {
                    for (let j = 0; j < currentResult.getStepsInfo().length; j += 1) {
                        const currentStep: StepInfo = currentResult.getStepsInfo()[j] as StepInfo;
                        const subTestTitle: string = currentStep.getName();
                        const subTestResult: string = currentStep.getIsDifferent() ? 'Passed' : 'Failed'
                        formattedString += `\t> ${subTestTitle} - ${subTestResult}\n`
                    }
                } else {
                    formattedString += '\tNo steps exist for this test.\n'
                }
            }
        }
        const sessionData: SessionUrls = this._resultsList[0].getAppUrls() as SessionUrls;
        formattedString += `See details at ${sessionData.getBatch()}`

        return formattedString
    }

    asHierarchicTAPString(includeSubTests: boolean = true, markNewAsPassed: boolean = false): string {
        if (this._resultsList.length === 0) {
            return '';
        }

        let tapString: string = `1..${this._resultsList.length}\n`;

        for (let i = 0; i < this._resultsList.length; i += 1) {
            const currentResult: TestResults = this._resultsList[i];
            const tapIndex = i + 1

            if (i > 0) {
                tapString += '#\n'
            }

            const name: string = `Test: '${currentResult.getName()}', Application: '${currentResult.getAppName()}'`

            if (currentResult.isPassed()) {
                tapString += `${Statuses.OK} ${tapIndex} - [PASSED TEST] ${name}\n`
            } else if (currentResult.getIsNew()) {
                // Test did not pass (might also be a new test).
                // New test
                const newResult = markNewAsPassed ? Statuses.OK : Statuses.NOT_OK;
                tapString += `${newResult} ${tapIndex} - [NEW TEST] ${name}\n`
            } else {
                // Failed / Aborted test.
                tapString += `${Statuses.NOT_OK} ${tapIndex} - `
                if (currentResult.getIsAborted()) {
                    tapString += `[ABORTED TEST] ${name}\n`
                } else {
                    tapString += `[FAILED TEST] ${name}\n`
                }
                tapString += `#\tMismatches: ${currentResult.getMismatches()}\n`
            }
            const session: SessionUrls = currentResult.getAppUrls() as SessionUrls;
            const url: string = session && session.getSession()
                ? session.getSession()
                : "No URL (session didn't start).";
            tapString += `#\tTest url: ${url}\n`;
            tapString += `#\tBrowser: ${currentResult.getHostApp()}, Viewport: ${currentResult.getHostDisplaySize()}\n`;

            if (includeSubTests) {
                if (currentResult.getStepsInfo().length > 0) {
                    tapString += `\t1..${currentResult.getStepsInfo().length}\n`
                    for (let j = 0; j < currentResult.getStepsInfo().length; j += 1) {
                        const currentStep: StepInfo = currentResult.getStepsInfo()[j] as StepInfo;
                        tapString += '\t'
                        tapString += currentStep.isDifferent ? Statuses.NOT_OK : Statuses.OK;
                        tapString += ` '${currentStep.getName()}', URL: ${currentStep.getAppUrls().getStep()}\n`
                    }
                } else {
                    tapString += '\tNo steps exist for this test.\n'
                }
            }
        }

        return tapString
    }

    asFlattenedTAPString(markNewAsPassed: boolean = false): string {
        if (this._resultsList.length === 0) {
            return ''
        }

        let tapString: string = ''
        let stepsCounter: number = 0

        // We'll add the TAP plan at the beginning, after we calculate the total number of steps.
        for (let i = 0; i < this._resultsList.length; i += 1) {
            tapString += '#\n'

            const currentResult: TestResults = this._resultsList[i]
            const tapIndex = i + 1

            const name = `Test: '${currentResult.getName()}', Application: '${currentResult.getAppName()}'`

            if (currentResult.isPassed()) {
                tapString += `# ${Statuses.OK} ${tapIndex} - [PASSED TEST] ${name}\n`
            } else if (currentResult.getIsNew()) {
                // Test did not pass (might also be a new test).
                // New test
                const newResult: string = markNewAsPassed ? Statuses.OK : Statuses.NOT_OK;
                tapString += `# ${newResult} ${tapIndex} - [NEW TEST] ${name}\n`
            } else {
                // Failed / Aborted test.
                tapString += `# ${Statuses.NOT_OK} ${tapIndex} - `
                if (currentResult.getIsAborted()) {
                    tapString += `[ABORTED TEST] ${name}\n`
                } else {
                    tapString += `[FAILED TEST] ${name}\n`
                }
                tapString += `#\tMismatches: ${currentResult.getMismatches()}\n`
            }
            const session: SessionUrls = currentResult.getAppUrls() as SessionUrls;
            const url: string =
                session && session.getSession()
                    ? session.getSession()
                    : "No URL (session didn't start)."

            tapString += `#\tTest url: ${url}\n`
            if (currentResult.getStepsInfo().length > 0) {
                for (let j = 0; j < currentResult.getStepsInfo().length; j += 1) {
                    stepsCounter += 1
                    const currentStep: StepInfo = currentResult.getStepsInfo()[j] as StepInfo;
                    tapString += currentStep.isDifferent ? Statuses.NOT_OK : Statuses.OK;
                    tapString += ` ${stepsCounter} '${currentStep.getName()}', URL: ${currentStep
                        .getAppUrls()
                        .getStep()}\n`
                }
            } else {
                tapString += '#\tNo steps exist for this test.\n'
            }
        }

        if (stepsCounter > 0) {
            tapString = `1..${stepsCounter}\n${tapString}`
        }

        return tapString
    }

    // TODO fix isError
    toXmlOutput({ totalTime }: TotalTime = {}) {
        const suiteName: string = 'Eyes Test Suite';
        let output: string = `<?xml version="1.0" encoding="UTF-8" ?>`;
        const testResults: TestResults[] = this._resultsList;
        output += `\n<testsuite name="${suiteName}" tests="${testResults.length}" time="${totalTime}">`;
        testResults.forEach((result: TestResults) => {
            const sessionData: SessionUrls = result.getAppUrls() as SessionUrls;
            const duration: number = result.getDuration();
            output += `\n<testcase name="${result.getName()}"${duration ? ' time="' + duration + '"' : ''
                }>`
            if (result.getIsDifferent()) {
                output += `\n<failure>`
                output += `\nDifference found. See ${sessionData.getBatch()} for details.`
                output += `\n</failure>`
            } else if (result.getIsAborted()) {
                output += `\n<failure>`
                output += `\nTest aborted.`
                output += `\n</failure>`
            } else if (result.isError) {
                output += `\n<failure>`
                output += `\n${result.error.message}`
                output += `\n</failure>`
            }
            output += `\n</testcase>`
        })
        output += `\n</testsuite>`
        return output
    }

    toJsonOutput(space: number = null): string {
        return JSON.stringify(this._resultsList, null, space)
    }
}
