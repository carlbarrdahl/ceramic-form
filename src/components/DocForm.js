import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@material-ui/core";
import Form from "@rjsf/material-ui";
//import { JsonForms } from "@jsonforms/react";
//import {
//  materialCells,
// materialRenderers,
//} from "@jsonforms/material-renderers";

import { toCamelCase } from "../App";
import { useCeramic } from "../hooks/ceramic";

export function useSchema({ name, schema, def }) {
  const { ceramic, idx } = useCeramic();
  const [data, setData] = useState({});
  const [error, setError] = useState();
  const [isLoading, setLoading] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    const defName = toCamelCase(name);
    console.log("Loading schema...", schema);
    setLoading(true);
    Promise.all([ceramic.loadDocument(schema), idx.get(def, idx.id)])
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
      console.log("Merging data...", data, content, name);
      setSubmitting(true);
      return (
        idx
          .merge(def, content)
          //[data.values ? "merge" : "set"](toCamelCase(name), content)
          .then(() => {
            console.log("Data merged successfully");
            setSubmitting("done");
            return { did: idx.id };
          })
          .catch(setError)
      );
    },
    [data, idx]
  );

  return { data, error, isLoading, isSubmitting, handleUpdate };
}

export default function DocumentForm({ definition, onSubmit }) {
  const [state, setState] = useState();
  const { data, error, isLoading, isSubmitting, handleUpdate } = useSchema(
    definition
  );
  if (isLoading) {
    return <pre>Loading form...</pre>;
  }
  return (
    <Box>
      {isSubmitting === "done" ? (
        <pre>Thank you! :)</pre>
      ) : isSubmitting ? (
        <pre>Saving...</pre>
      ) : (
        data.schema && (
          <Form
            schema={data.schema}
            validate={() => false}
            noHtml5Validate
            formData={data.values}
            onSubmit={(values) => handleUpdate(values.formData).then(onSubmit)}
            onError={(err) => console.log(err)}
          />
        )
      )}
      <pre style={{ color: "red" }}>
        {JSON.stringify(error?.toString(), null, 2)}
      </pre>
    </Box>
  );
}
