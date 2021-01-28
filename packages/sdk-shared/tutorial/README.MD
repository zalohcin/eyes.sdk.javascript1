There are tutorial.sh script to build and run docker images for testing the tutorials.
Script builds the base image with nodejs, xvfb and fluxbox to run headful browsers.
Then from the base image built image with the SDK.
Tutorials image built from the SDK images.
When images are build they run and then reported to the dashboard.
Status of the tutorial defined by the exit code of the execution.

Tutorials use env variable `APPLITOOLS_COVERAGE_REPORT_ID` for the report id, if such env variable isn't set it generates a new id with uuidgen utility.
In such case tutorials will make separate test run on the QA dashboard.

Some tutorials use the selenium running on the host machine. (Uses `host.docker.internal` hostname)
They are require `yarn docker:setup` to be up before running the tutorials.
 - eyes-protractor
 - eyes-nightwatch
 - eyes-webdriverio-4
 - eyes-webdriverio-5

Tutorials sent to dashboard with test names `tutorial_basic`, `tutorial_ultrafastgrid`.

Eyes-selenium package has to set of the tutorials, script check env variable `APPLITOOLS_SELENIUM_MAJOR_VERSION` to choose between selenium3 and selenium4. (Selenium4 is a default)

Eyes-webdriverio5 has a tutorials with wdio6, there are separate script `tutorial_wdio6.sh` which check the wdio6 tutorials but don't sent then to the dashboard cause we don't have separate suite for the wdio6.
