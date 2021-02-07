import { useState } from "react";

import CeramicProvider from "./hooks/ceramic";

import DocumentForm from "./components/DocForm";
import Controls from "./components/Controls";
import Profile from "./components/Profile";

function App() {
  const [state, setState] = useState(() =>
    Object.fromEntries(new URLSearchParams(window.location.search))
  );

  return (
    <main style={{ margin: "0 auto", maxWidth: 768 }}>
      <h1>Ceramic form</h1>
      <p>
        Enter a document ID and a form is automagically rendered based on the
        json-schema for the data.
      </p>
      <p>Try to update the fields and press submit.</p>
      <p>
        Parameters can be linked in the url as query params:{" "}
        <code>apiHost</code>, <code>seed</code>, and <code>doc</code>
      </p>
      <p>
        Example:{" "}
        <pre style={{ overflowX: "scroll", padding: 8 }}>
          {window.location.origin}
          ?apiHost=http://localhost:7007&doc=kjzl6cwe1jw147ifstjj0s89x6791tox2phgttepmgao70jvocpoah6hck6v5zy&seed=f689625a1b1a5943a4c8ad1b23325455cfb0871503e387cc1e7d9b6acb3dc431
        </pre>
      </p>
      <CeramicProvider apiHost={state.apiHost} seed={state.seed}>
        <Profile />
        <Controls doc={state.doc} seed={state.seed} onChange={setState} />
        <DocumentForm id={state.doc} />
      </CeramicProvider>
    </main>
  );
}

export default App;
