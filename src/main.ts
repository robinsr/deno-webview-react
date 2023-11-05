import WorkerBot from "./worker-bot.ts";
import View from "./webview.ts";
import { PORT } from "./config.ts";
const Server = './server.ts'
import getLogger from './log.ts';
import { delay } from './deps.server.ts'

const { log, error } = getLogger('Main', 'yellow');

const serverWorker = new WorkerBot(Server);
const view = new View(serverWorker);

const appUrl = `http://localhost:${PORT}`;

setTimeout(async () => {
  log(`Navigating web view to ${appUrl}`);
  view.url(appUrl);
  // blocks from here

  await serverWorker.terminate();
  await delay(1000);

  log('Webview closed. Good-bye!');
  Deno.exit(0);
}, 200);

