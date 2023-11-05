import { Webview, SizeHint, Status } from './deps.server.ts';
import html from './html.ts';
import WorkerBot from './worker-bot.ts';
import getLogger from './log.ts';
import { WebviewRPCCall, WebviewClick, WebviewKeypress } from './app/api.ts';

const { log, error } = getLogger('view', 'blue');
const { log: feLog } = getLogger('feLog', 'cyan');

const WindowTitle = 'DenoApp';

class View  {
  readonly webview: Webview;
  location = null;

  constructor(server: WorkerBot) {
    this.webview = new Webview(true, { width: 800, height: 600, hint: SizeHint.NONE });
    this.webview.title = WindowTitle;


    let counter = 0;

    const { port1, port2 } = new MessageChannel();

    port2.onmessage = (e) => server.send(e);


    // Create and bind `press` to the webview javascript instance.
    // This functions in addition to logging its parameters also returns
    // a value from deno land to webview land.
    this.webview.bind("server_click", (evt: WebviewClick) => {
      log("click", evt);

      if (evt.detail.data.method) {
        server.send(evt.detail.data);
      }

      // returns value to webview
      return { status: 'ok' };
    });

    this.webview.bind("server_keypress", (evt: WebviewKeypress) => {
      log("keypress", evt);

      const { key, ctrlKey } = evt.detail;

      if (ctrlKey && key === 'c') {
        this.webview.destroy();
      }

      return { status: 'ok' }
    });

    this.webview.bind("server_rpc", (evt: WebviewRPCCall) => {
      log("rpc", evt);

      // MessageChannel refuses to work, possibly due
      // to Webview blocking the thread
      //port1.postMessage(evt.detail);

      server.send(evt.detail);

      return { status: 'ok', method: evt.detail.method }
    });

    // Bind the `log` function in the webview to the parent instances `console.log`
    this.webview.bind("server_log", (...args) => feLog(...args));

    this.webview.bind("close", () => {
      this.webview.destroy();
    });

    this.webview.init(`
      new EventSource("/channel").onmessage = (e) => {
        if (e.data === 'reload') window.reload();
      }
    `)
  }

  url(url: string) {
    this.location = url;
    this.webview.navigate(url);
    this.webview.run();
  }

  dataUrl() {
    this.webview.navigate(`data:text/html,${encodeURIComponent(html())}`);
    this.webview.run();
  }

  reload() {
    if (this.location) {
      this.webview.navigate(this.location);
    } else {
      error('No location set on Webview; cannot reload');
    }
  }
}

export default View;
