/// <reference lib="webworker"/>

import {
  Application,
  Context,
  Router,
  ServerSentEvent,
  ServerSentEventTarget,
  ServerSentEventStreamTarget,
  Status,
  delay
} from './deps.server.ts';

import { PORT } from './config.ts';
import html from './html.ts';
import getLogger from './log.ts';
import { green, cyan, yellow, bold, magenta } from 'std/fmt/colors.ts';


const { log } = getLogger('Server', 'green');

let counter = 0;

class Server {
  app: Application;
  target: ServerSentEventTarget = new ServerSentEventStreamTarget()

  constructor() {

    const app = new Application();
    const router = new Router();

    router.get("/", (ctx, next) => {
      ctx.response.body = html()
      ctx.response.type = "html";
      next();
    });

    router.get("/data.json", async (ctx, next) => {
      await delay(1000);
      ctx.response.body = { message: "Hello from Oak" }
      ctx.response.type = "json";
      next();
    });

    router.get("/error.json", async (ctx, next) => {
      await delay(1000);
      ctx.response.status = Status.NotAcceptable;
      ctx.response.body = 'How dare you!?'
      next();
    });

    router.get("/channel", (ctx: Context, next) => {
      ctx.assert(
        ctx.request.accepts("text/event-stream"),
        Status.UnsupportedMediaType,
      );
      const connection = ctx.request.ip;
      this.target = ctx.sendEvents();

      log(`${green("SSE connect")} ${cyan(connection)}`);

      this.target.addEventListener("close", () => {
        log(`${green("SSE disconnect")} ${cyan(connection)}`);
      });

      next();
    });

    app.use(router.routes());
    app.use(router.allowedMethods());

    app.use(ctx => {
      const { url, method } = ctx.request;
      log('Incoming request:', magenta(method), url.pathname);
    })

    app.addEventListener("listen", ({ hostname, port, serverType }) => {
      log(bold("Start listening on ") + yellow(`${hostname}:${port}`));
      log(bold("  using HTTP server: " + yellow(serverType)));
    });

    this.app = app;
  }

  async start() {
    await this.app.listen({ hostname: "127.0.0.1", port: PORT });
  }

  send(msg: string | object) {
    const evtInit = { data: { msg }, id: counter++ };
    this.target.dispatchEvent(new ServerSentEvent("message", evtInit));
    log("Message dispatched");
  }
}

self.onmessage = (evt: MessageEvent) => {
  log('Received message:', evt.data);
  server.send(evt.data);
};

const server = new Server();

await server.start();
