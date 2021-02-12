import Ceramic from "@ceramicnetwork/http-client";
import { IDX } from "@ceramicstudio/idx";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import getAuthProvider from "./wallet";

const CeramicContext = createContext({});

export const useCeramic = () => useContext(CeramicContext);

export function useAuth() {
  const { ceramic, idx } = useCeramic();
  const [isLoading, setLoading] = useState(false);
  const [profile, setProfile] = useState();
  const [error, setError] = useState();

  const signIn = useCallback(async () => {
    console.log("Signin in...");
    setLoading(true);
    try {
      const provider = await getAuthProvider();
      await ceramic.setDIDProvider(provider);

      console.log("Signin successful", idx.id);
      localStorage.setItem("hasSignedIn", idx.id);

      console.log("Getting profile...");
      const _profile = (await idx.get("basicProfile")) || {};
      setProfile(_profile);
      console.log("Profile found", _profile);
      setLoading(false);
    } catch (error) {
      console.error(error);
      localStorage.clear();
      setError(error?.toString());
    }
  }, [ceramic]);

  const hasSignedIn = localStorage.getItem("hasSignedIn");
  useEffect(async () => {
    if (ceramic && hasSignedIn) await signIn();
  }, [hasSignedIn, ceramic]);

  return { profile, error, isLoading, signIn };
}
export default function CeramicProvider({
  // apiHost = "http://localhost:7007",
  apiHost = "https://ceramic-clay.3boxlabs.com",
  //apiHost = "https://gateway-clay.ceramic.network",
  children,
  aliases,
}) {
  const [context] = useState(() => {
    const ceramic = new Ceramic(apiHost);
    const idx = new IDX({ ceramic, aliases });

    // Useful for debugging
    window.ceramic = ceramic;
    window.idx = idx;

    return { ceramic, idx };
  });

  return (
    <CeramicContext.Provider value={context}>
      {children}
    </CeramicContext.Provider>
  );
}
