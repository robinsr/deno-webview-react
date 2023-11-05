/// <reference lib="lib.dom"/>

import { Navigate, React, Route, Routes } from "../deps.client.ts";
import { NavBar } from "./components/NavBar.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { GettingStartedPage } from "./pages/GettingStartedPage.tsx";
import { UserPage } from "./pages/UserPage.tsx";
import { Footer } from "./components/Footer.tsx";

import { bulma } from '../deps.client.ts';
const { Container } = bulma;

const keyData = (evt: KeyboardEvent) => {
  const { key, altKey, ctrlKey, metaKey, shiftKey } = evt;
  return { key, altKey, ctrlKey, metaKey, shiftKey };
}

export default function App(props: any) {

  React.useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      e.preventDefault();

      server_keypress({
        type: 'keypress',
        detail: {
          ...keyData(e),
          data: {
            time: e.timeStamp
          }
        }
      }).then(server_log);
    }

    document.addEventListener('keyup', handleKeys);
    return () => {
      document.removeEventListener('keyup', handleKeys);
    }
  });

  return (
    <>
      <NavBar />
      <Container>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/getting-started" element={<GettingStartedPage />} />
          <Route path="/users/:username" element={<UserPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </Container>
    </>
  );
}