import Redis from 'ioredis';
import express from 'express';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});
const app = express();

// await redis.set('mykey', '123123');
// await redis.get('mykey');

app.get('/deleteAll', async (req, res, next) => {
  let out = '';
  const keys = await redis.keys('*');
  for (const key of keys) {
    redis.del(key);
    out += '<br>================================<br>';
    out += `<b>${ key }</b>`;
    out += '<br>================================<br>';
  }

  return res.send(out).status(200).end();
});

app.get('/*', async (req, res, next) => {

  const pattern = req.query.pattern ? `*${ req.query.pattern }*` : '*';
  console.log('pattern', pattern);

  let out = `Pattern: <b>${ pattern }</b>`;

  const keys = await redis.keys(pattern);
  for (const key of keys) {
    out += '<br>================================<br>';
    out += `<b>${ key }</b> <br> ${ JSON.stringify(await redis.get(key)) }`;
    out += '<br>================================<br>';
  }

  return res.send(out).status(200).end();
});

const port = 3011;
app.listen(port, err => {
    if (err) throw err;
    console.log(` > Ready on http://localhost:${ port }`);
  }
);