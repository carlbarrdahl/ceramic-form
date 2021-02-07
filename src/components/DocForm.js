import { useCallback, useEffect, useState } from "react";
import Form from "@rjsf/fluent-ui";

import { useCeramic } from "../hooks/ceramic";

function useDocForm({ id }, ceramic) {
  const [data, setData] = useState();
  const [schema, setSchema] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    if (id && ceramic) {
      ceramic
        .loadDocument(id)
        .then((doc) => {
          if (doc.metadata.schema) {
            ceramic.loadDocument(doc.metadata.schema).then((schemaDoc) => {
              setData(doc);
              setSchema(schemaDoc);
            });
          } else {
            // Document is schema
            setSchema(doc);
            setData();
          }
        })
        .catch((err) => {
          setError(err);
        });
    }
  }, [ceramic, id]);

  const handleUpdate = useCallback(
    (content) => {
      console.log("handleUpdate", data, content);
      if (data) {
        data
          .change({ content })
          .then(() => ceramic.loadDocument(data.id.toString()).then(setData))
          .catch((err) => {
            console.log(err);
            setError(err);
          });
      } else {
        // TODO: Create a new document
        console.log("TODO: create a new document", {
          content,
          metadata: { schema: `ceramic://${id}` },
        });
        /*
        ceramic
          .createDocument("tile", {
            content,
            metadata: { schema: `ceramic://${id}` },
          })
          .then((doc) => {
            console.log("res", doc, doc?.id, doc?.content, doc?.id.toString());
          });
        */
      }
    },
    [data]
  );
  return { data, error, schema, handleUpdate };
}

export default function DocumentForm({ id }) {
  const { data, error, schema, handleUpdate } = useDocForm({ id });
  return (
    <div>
      {schema?.content && (
        <Form
          schema={schema.content}
          formData={data?.content || {}}
          onSubmit={(values) => handleUpdate(values.formData)}
          onError={(err) => console.log(err)}
        />
      )}
      <pre style={{ color: "red" }}>
        {JSON.stringify(error?.toString(), null, 2)}
      </pre>
      <pre>
        {JSON.stringify(
          {
            content: data?.content,
            controllers: data?.controllers,
            metadata: data?.metadata,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}
