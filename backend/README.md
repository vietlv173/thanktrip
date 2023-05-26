## Prerequisites

- Node >= 12.14.0
- Yarn >=1.22.4
- Pm2 >= 5.3.0

## Install Puppeteer

```bash

# Install libx stuff 
$ sudo apt-get install libpangocairo-1.0-0 libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libgconf-2-4 libasound2 libatk1.0-0 libgtk-3-0
```

## Usage

```bash
# generate .env file and add configuration
$ cp .env.example .env

$ npm install

# start backend running in dev: localhost:9000
$ npm run backend

# start backend running in production:
$ pm2 start bin/www
```