import { useState } from "react";
import { Box, Button, Divider, Typography } from "@material-ui/core";
import CeramicProvider, { useAuth } from "./hooks/ceramic";
import { definitions } from "@ceramicstudio/idx-constants";

import DocumentForm from "./components/DocForm";
import { useDefinition } from "./hooks/schema";

function App({ def, successUrl }) {
  const { profile, isLoading, signIn } = useAuth();

  const { data, error } = useDefinition(def);

  return (
    <Box mx="auto" maxWidth={768}>
      {error && <pre>{error}</pre>}
      <Box py={4} px={4}>
        {error && <pre>{error}</pre>}
        <Box mb={3}>
          <Typography variant="h5" gutterBottom>
            {data?.name}
          </Typography>
          <Typography variant="body1">{data?.description}</Typography>
        </Box>
        <Divider light />

        {isLoading ? (
          <pre>Loading profile...</pre>
        ) : profile ? (
          <DocumentForm
            definition={data}
            onSubmit={({ did }) => {
              console.log("Calling successUrl", successUrl, did);
              successUrl &&
                fetch(`${successUrl}?did=${did}&def=${def}`)
                  .then((res) => {
                    console.log("SuccessUrl called successfully");
                  })
                  .catch(console.error);
            }}
          />
        ) : (
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={signIn}
          >
            Sign in to get started
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default () => {
  const [params] = useState(() =>
    Object.fromEntries(new URLSearchParams(window.location.search))
  );
  if (!params.def) {
    const exampleUrl = `${window.location.origin}?def=BasicProfile`;
    return (
      <pre>
        URL params missing - def is required. <br />
        Try this: <a href={exampleUrl}>{exampleUrl}</a>
      </pre>
    );
  }
  const defName = toCamelCase(params.def);
  if (definitions[defName]) {
    params.def = definitions[defName];
  }

  return (
    <CeramicProvider {...params}>
      <App {...params} />
    </CeramicProvider>
  );
};

export function toCamelCase(str) {
  str = str.replace(/[-_\s]+(.)?/g, (match, ch) =>
    ch ? ch.toUpperCase() : ""
  );

  return str.substr(0, 1).toLowerCase() + str.substr(1);
}
