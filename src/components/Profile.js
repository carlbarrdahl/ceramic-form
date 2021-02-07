import { useCeramic } from "../hooks/ceramic";

export default function Profule({ id }) {
  const { idx } = useCeramic();
  return (
    <div>
      <pre>Logged in as: {idx?.id}</pre>
    </div>
  );
}
