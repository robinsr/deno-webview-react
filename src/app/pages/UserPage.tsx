import { React, useParams, bulma } from "../../deps.client.ts";

const { Section } = bulma;

export function UserPage() {
  const { username } = useParams();
  return (
    <Section>
      <h1>Hi, {username}!</h1>
      <p>
        This page grabs the `username` from the route `/users/:username`.
      </p>
      <p>
        Try updating the route with your own name!
      </p>
    </Section>
  );
}