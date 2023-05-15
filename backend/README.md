## Prerequisites

- Node >= 12.14.0
- Yarn >=1.22.4
- Pm2 >= 5.3.0

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
