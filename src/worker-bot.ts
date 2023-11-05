import getLogger from './log.ts';

const { debug, log, error } = getLogger('Worker', 'yellow');


class WorkerBot extends EventTarget {
  readonly worker: Worker;
  #closed = false;
  get closed() {
    return this.#closed;
  }

  constructor(script: string, onclose: () => unknown = () => void 0) {
    super();

    this.worker = new Worker(
      new URL(script, import.meta.url),
      {
        type: "module",
        deno: {
          namespace: true,
          permissions: "inherit"
        },
      } as never,
    );

    this.worker.addEventListener("message", (evt) => {
      log(`[Window "${script}"] Message:`, evt.data);
      if (evt.data === "close") {
        this.#closed = true;
        onclose();
      }
    });

    this.worker.addEventListener(
      "messageerror",
      (evt) => error(`[Window "${script}"] Message Error:`, evt.data),
    );

    this.worker.addEventListener(
      "error",
      (evt) => error(`[Window "${script}"] Error:`, evt),
    );
  }

  terminate(): Promise<void> {
    if (this.closed) {
      return Promise.resolve();
    }

    return new Promise<void>((res) =>
      setTimeout(() => {
        this.worker.postMessage("unload");
        this.worker.terminate();
        this.#closed = true;
        res();
      }, 25)
    );
  }

  send(msg: unknown) {
    debug('passing on message:', msg);
    this.worker.postMessage(msg);
  }
}

export default WorkerBot;
