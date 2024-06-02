const Koa = require('koa');
const views = require('koa-views');
const staticCache = require('koa-static-cache');
const Router = require('koa-router');
const history = require('koa-history-api-fallback');

const app = new Koa();
app.use(history());
const router = new Router();
const render = views(__dirname + '/build/', { extension: 'html' });

router.get('/', async (ctx) => {
  await ctx.render('index');
});

app.use(
  staticCache(__dirname + '/build/', {
    maxAge: 10 * 24 * 60 * 60
  })
);

// app.use(async ctx => {
//   ctx.body = 'Hello World';
// });

app.use(render);
app.use(router.routes());

app.listen(3001);
console.log('Server running at http://localhost:3001/');
