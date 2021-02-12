import { useCallback, useEffect, useState } from "react";
import { toCamelCase } from "../App";
import { useCeramic } from "./ceramic";

export function useDefinition(def) {
  const { ceramic, idx } = useCeramic();
  const [data, setData] = useState({});
  const [error, setError] = useState();

  useEffect(() => {
    console.log("Getting definition...", def);
    def &&
      ceramic
        .loadDocument(def)
        .then(async ({ content }) => {
          console.log("Definition loaded successfully", content);
          setData(content);
        })
        .catch((err) => setError(err?.toString()));
  }, [def, ceramic]);

  const handleUpdate = useCallback(
    (content) => {
      console.log("Merging data...", data, content);
      return idx
        .merge(toCamelCase(data.definition.name), content)
        .then(() => {
          console.log("Data merged successfully");
          return { did: idx.id };
        })
        .catch(setError);
    },
    [data, idx]
  );

  return { data, error, handleUpdate };
}
