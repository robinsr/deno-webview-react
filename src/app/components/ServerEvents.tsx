import { React, nanoid, bulma } from '../../deps.client.ts';

const { Block, Box, Button } = bulma;

const mouseData = (evt: MouseEvent) => {
  const { pageX, pageY, altKey, ctrlKey, metaKey, shiftKey, button } = evt;
  return {
    mouse: { pageX, pageY, button },
    keys: { altKey, ctrlKey, metaKey, shiftKey }
  }
}

const ServerEvents = () => {

  const [ messages, setMessages ] = React.useState<string[]>([]);

  React.useEffect(() => {
    function fetchData() {
      server_log('Reconnecting to /channel');
      const evtSource = new EventSource("/channel");
      evtSource.onmessage = (event) => {
        setMessages([ ...messages, event.data ]);
      };
    }

    let ignore = false;
    fetchData();
    return () => {
      ignore = true;
    }
  }, [ messages ]);

  const handleClick = (e: MouseEvent) => {
    server_click({
      type: 'click',
      detail: {
        source: 'ServerEvents',
        message: 'I was pressed!',
        data: {
          time: new Date().toISOString()
        }
      }
    }).then(server_log);
  }

  const handleRPC = (e: MouseEvent) => {
    server_rpc({
      type: 'rpc',
      detail: {
        method: 'triggerServerEvent',
        params: {
          ...mouseData(e),
          time: new Date().toISOString(),
        }
      }
    }).then(server_log);
  }

  return (
    <Box>
      <Block>
        <p className={'is-size-4'}>Server Events Test</p>
        <p>See docs: <a href="https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events">Server Events - MDN</a></p>
      </Block>
      <Block>
        <Button.Group>
          <Button color={'info'} onClick={handleClick}>Test click evt</Button>
          <Button color={'success'} onClick={handleRPC}>Test RPC evt</Button>
        </Button.Group>
      </Block>
      <Block>
        <ul>
          {messages.map(m => (
            <li key={nanoid(12)}><pre>{m}</pre></li>
          ))}
        </ul>
      </Block>
    </Box>
  )
}

export default ServerEvents;
