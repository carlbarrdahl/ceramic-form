import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@material-ui/core";
// import Form from "@rjsf/material-ui";
import { JsonForms } from "@jsonforms/react";
import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";

import { toCamelCase } from "../App";
import { useCeramic } from "../hooks/ceramic";

export function useSchema({ name, schema }) {
  const { ceramic, idx } = useCeramic();
  const [data, setData] = useState({});
  const [error, setError] = useState();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const defName = toCamelCase(name);
    console.log("Loading schema...", schema);
    setLoading(true);
    Promise.all([ceramic.loadDocument(schema), idx.get(defName, idx.id)])
      .then(([doc, values]) => {
        console.log("Schema loaded successfully", doc);
        console.log("With existing data", values);

        setData({ values, schema: doc.content });
      })
      .catch((err) => setError(err?.toString()))
      .finally(() => setLoading(false));
  }, [name, schema, ceramic]);

  const handleUpdate = useCallback(
    (content) => {
      console.log("Merging data...", data, content);
      return idx
        .merge(toCamelCase(name), content)
        .then(() => {
          console.log("Data merged successfully");
          return { did: idx.id };
        })
        .catch(setError);
    },
    [data, idx]
  );

  return { data, error, isLoading, handleUpdate };
}

export default function DocumentForm({ definition, onSubmit }) {
  const [state, setState] = useState();
  const { data, error, isLoading, handleUpdate } = useSchema(definition);
  console.log("schema", data, error);
  if (isLoading) {
    return <pre>Loading form...</pre>;
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleUpdate(state).then(onSubmit);
      }}
    >
      {data.schema && (
        <Box pt={3}>
          <JsonForms
            schema={data.schema}
            //uischema={uischema}
            data={data.values}
            renderers={materialRenderers}
            cells={materialCells}
            onChange={({ errors, data }) => setState(data)}
          />
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Box>
        </Box>
        /*  <Form
          schema={data.content}
          validate={() => false}
          noHtml5Validate
          formData={values}
          onSubmit={(values) => handleUpdate(values.formData)}
          onError={(err) => console.log(err)}
        /> */
      )}
      <pre style={{ color: "red" }}>
        {JSON.stringify(error?.toString(), null, 2)}
      </pre>
    </form>
  );
}
