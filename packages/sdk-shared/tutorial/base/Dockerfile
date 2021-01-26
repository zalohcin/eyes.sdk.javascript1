FROM ubuntu:18.04

RUN apt-get update && apt-get clean && apt-get install -y \
    x11vnc \
    xvfb \
    fluxbox \
    wmctrl \
    wget \
    curl \
    gnupg2 \
    default-jdk \
    unzip \
    && apt update \
    && apt install -y git

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update && apt-get -y install google-chrome-stable

COPY /chrome_wrapper.sh /opt/bin/wrap_chrome_binary
RUN /opt/bin/wrap_chrome_binary

RUN wget "https://chromedriver.storage.googleapis.com/$(wget -qO - "https://chromedriver.storage.googleapis.com/LATEST_RELEASE")/chromedriver_linux64.zip"
RUN unzip chromedriver_linux64
RUN mv chromedriver /usr/bin/

ENV DISPLAY :1
COPY /bootstrap.sh /

RUN  curl -sL https://deb.nodesource.com/setup_current.x | bash - \
     && apt-get update \
     && apt-get install -y nodejs


