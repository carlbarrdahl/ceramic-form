import { useState } from "react";
import { PrimaryButton, TextField, Text, Label } from "@fluentui/react";

export default function Controls({ doc, seed, onChange }) {
  const [values, setValues] = useState({ seed, doc });

  function handleChange(e) {
    setValues((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onChange(values);
      }}
    >
      <TextField
        name="seed"
        label="Seed"
        value={values.seed}
        onChange={handleChange}
      />
      <TextField
        name="doc"
        label="Document ID"
        value={values.doc}
        onChange={handleChange}
      />
      <PrimaryButton type="submit">Update</PrimaryButton>
    </form>
  );
}
