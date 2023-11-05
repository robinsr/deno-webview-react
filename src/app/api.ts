


// how to map this from other types?
export type WebviewEventTypes = 'click' | 'keypress'

export type WebviewEventPayload = {
  [prop: string]: unknown;
}

export type WebviewClick = {
  type: 'click';
  detail: {
    source: string;
    message: string;
    data: WebviewEventPayload;
  }
}

export type WebviewKeypress = {
  type: 'keypress';
  detail: {
    key: string;
    altKey: boolean;
    metaKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    data: WebviewEventPayload;
  }
}

export type WebviewRPCCall = {
  type: 'rpc';
  detail: {
    method: string;
    params?: WebviewEventPayload
  }
}

export type WebviewEvent = WebviewClick | WebviewKeypress | WebviewRPCCall;

declare global {
  const server_log: (...args: any[]) => void;
  const server_rpc: <T> (e: WebviewRPCCall) => Promise<T>;
  const server_click: <T> (e: WebviewClick) => Promise<T>;
  const server_keypress: <T> (e: WebviewKeypress) => Promise<T>;
}
