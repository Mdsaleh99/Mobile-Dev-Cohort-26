import * as React from "react";

import { BASE_URL } from "@/constants";
import {
  AuthRequestConfig,
  DiscoveryDocument,
  makeRedirectUri,
  useAuthRequest,
} from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import * as jose from "jose";

interface AuthUser {
  name: string;
  email: string;
  picture: string;
}

type Provider = "google" | "github";

interface AuthContextType {
  user: AuthUser | null;
  signIn: (provider?: Provider) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  isReady: boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const googleConfig: AuthRequestConfig = {
  clientId: "google",
  scopes: ["openid", "profile", "email"],
  redirectUri: makeRedirectUri(),
  extraParams: { provider: "google" },
};

const githubConfig: AuthRequestConfig = {
  clientId: "github",
  scopes: ["read:user", "user:email"],
  redirectUri: makeRedirectUri(),
  usePKCE: false,
  extraParams: { provider: "github" },
};

const discovery: DiscoveryDocument = {
  authorizationEndpoint: `${BASE_URL}/api/auth/authorize`,
  tokenEndpoint: `${BASE_URL}/api/auth/token`,
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [googleRequest, googleResponse, googlePromptAsync] = useAuthRequest(
    googleConfig,
    discovery,
  );
  const [githubRequest, githubResponse, githubPromptAsync] = useAuthRequest(
    githubConfig,
    discovery,
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    if (googleResponse?.type === "success") {
      handleAuthResponse(
        googleResponse.params.code,
        "google",
        googleRequest?.codeVerifier,
      );
    }
  }, [googleResponse]);

  React.useEffect(() => {
    if (githubResponse?.type === "success") {
      handleAuthResponse(
        githubResponse.params.code,
        "github",
        githubRequest?.codeVerifier,
      );
    }
  }, [githubResponse]);

  React.useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync("accessToken");

      if (storedToken) {
        const decoded = jose.decodeJwt(storedToken);
        const exp = (decoded as any).exp;
        const now = Math.floor(Date.now() / 1000);

        if (exp && now < exp) {
          setAccessToken(storedToken);
          setUser(decoded as unknown as AuthUser);
        }
      }
    } catch (error) {
    } finally {
      setIsReady(true);
    }
  };

  const handleAuthResponse = async (
    code: string,
    provider: Provider,
    codeVerifier?: string,
  ) => {
    try {
      setIsLoading(true);
      const formData = new URLSearchParams();

      formData.append("code", code);
      formData.append("provider", provider);
      if (codeVerifier) {
        formData.append("code_verifier", codeVerifier);
      }

      const tokenResponse = await fetch(`${BASE_URL}/api/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData?.toString(),
      });

      const tokens = await tokenResponse?.json();
      if (!tokenResponse.ok || typeof tokens.accessToken !== "string") {
        console.error("Token exchange failed:", tokens);
        return;
      }

      await SecureStore.setItemAsync("accessToken", tokens.accessToken);
      setAccessToken(tokens.accessToken);
      const decoded = jose.decodeJwt(tokens.accessToken);
      setUser(decoded as unknown as AuthUser);
    } catch (error) {
      console.error("Error handling auth response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (provider: Provider = "google") => {
    try {
      if (provider === "github") {
        if (!githubRequest) return;
        await githubPromptAsync();
      } else {
        if (!googleRequest) return;
        await googlePromptAsync();
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading, isReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
