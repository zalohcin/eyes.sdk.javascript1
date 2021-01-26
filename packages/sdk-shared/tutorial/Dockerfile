ARG from=tutorial_nodejs:latest
FROM ${from}

ARG repo=tutorial-selenium-javascript-basic
RUN mkdir //home/project \
    && cd home/project \
    && git clone https://github.com/applitools/${repo}.git \
    && cd ${repo} \
    && npm install //SDK \
    && find ./test -type f -exec sed -i "s/'APPLITOOLS_API_KEY'/process.env.APPLITOOLS_API_KEY/g" {} \;
WORKDIR home/project/$repo
CMD //bootstrap.sh > /dev/null 2>&1 && npm test

