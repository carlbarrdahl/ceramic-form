import Ceramic from "@ceramicnetwork/http-client";
import { IDX } from "@ceramicstudio/idx";
import { createContext, useContext, useEffect, useState } from "react";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { fromString } from "uint8arrays";
import getAuthProvider from "./wallet";

const CeramicContext = createContext({});

export const useCeramic = () => useContext(CeramicContext);

export default function CeramicProvider({
  apiHost = "https://gateway-clay.ceramic.network",
  children,
  aliases,
  seed,
}) {
  const [state, setState] = useState({});

  useEffect(async () => {
    const ceramic = new Ceramic(apiHost);
    if (seed) {
      await ceramic.setDIDProvider(
        new Ed25519Provider(fromString(seed, "base16"))
      );
    } else {
      const provider = await getAuthProvider();
      await ceramic.setDIDProvider(provider);
    }
    const idx = new IDX({ ceramic, aliases });

    window.ceramic = ceramic;
    window.idx = idx;

    setState({ ceramic, idx });
  }, [seed]);

  return (
    <CeramicContext.Provider value={state}>{children}</CeramicContext.Provider>
  );
}
