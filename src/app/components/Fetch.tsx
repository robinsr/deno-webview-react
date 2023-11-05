import { React, bulma } from "../../deps.client.ts";

const { Block, Box, Button } = bulma;

type LoadingState = {
  state: 'loading';
}

type SuccessState = {
  state: 'success';
  data: object;
}

type ErrorState = {
  state: 'error';
  error: string;
}

type FetchState = LoadingState | SuccessState | ErrorState;

export function Fetch() {
  const dataUrl = "/data.json";
  const errorUrl = "/error.json";

  const [ url, setUrl ] = React.useState(dataUrl);

  const [ result, setResult ] = React.useState<FetchState>({
    state: 'loading'
  });

  React.useEffect(() => {
    async function fetchData() {
      setResult({ state: 'loading' });
      const response = await fetch(url);

      if (!ignore && response.ok) {
        const json = await response.json();
        server_log(json);
        setResult({ state: 'success', data: json });
      }

      if (!ignore && !response.ok) {
        const error = await response.text();
        server_log(error);
        setResult({ state: 'error', error });
      }
    }

    let ignore = false;
    fetchData();
    return () => {
      ignore = true;
    }
  }, [url]);

  return (
    <Box>
      <Block>
        <p className={'is-size-4'}><code>fetch</code> Test</p>
      </Block>
      <Block>
        <Button.Group>
          <Button color={'info'} onClick={() => setUrl(dataUrl)}>
            Fetch data
          </Button>
          <Button color={'danger'} onClick={() => setUrl(errorUrl)}>
            Cause error
          </Button>
        </Button.Group>
      </Block>
      <Block>
        Status: { result.state }
      </Block>
      { result.state == 'success' &&
      <Block>
        <pre>
          <code>{JSON.stringify(result.data)}</code>
        </pre>
      </Block>
      }
      { result.state == 'error' &&
      <Block>
        <pre>
          <code>{result.error}</code>
        </pre>
      </Block>
      }
    </Box>
  );
}
