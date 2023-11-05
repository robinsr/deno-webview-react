import { React, bulma } from "../../deps.client.ts";
import { Fetch } from '../components/Fetch.tsx';
import ServerEvents from '../components/ServerEvents.tsx';

const { Section } = bulma;


export function HomePage() {

  server_log('HomePage component');

  return (
    <Section>
      <Section>
        <h1 className={'title'}>Deno x React</h1>
        <p>
          This is a starter React app running on{" "}
          <a href="https://deno.land/" target="_blank">Deno</a>.
        </p>
        <hr/>
      </Section>
      <Fetch />
      <ServerEvents />
    </Section>
  );
}