import {
    BASE_URL,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    JWT_SECRET,
} from "@/constants";
import * as jose from "jose";

interface NormalizedUser {
  sub: string;
  name: string;
  email: string;
  picture: string;
}

const CALLBACK_URI = `${BASE_URL}/api/auth/callback`;

export async function POST(request: Request) {
  try {
    const formData = new URLSearchParams(await request.text());
    const code = formData.get("code");
    const codeVerifier = formData.get("code_verifier");
    const provider = formData.get("provider") ?? "google";

    if (!code) {
      return Response.json({ error: "Missing code" }, { status: 400 });
    }

    const user =
      provider === "github"
        ? await exchangeGithub(code)
        : await exchangeGoogle(code, codeVerifier);

    if (!user) {
      return Response.json({ error: "Token exchange failed" }, { status: 400 });
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const accessToken = new jose.SignJWT({
      sub: user.sub,
      name: user.name,
      email: user.email,
      picture: user.picture,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .setIssuedAt()
      .sign(secret);

    return Response.json({ accessToken, user });
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return Response.json(
      { error: "Failed to exchange code for token" },
      { status: 500 },
    );
  }
}

async function exchangeGithub(code: string): Promise<NormalizedUser | null> {
  const tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        code,
        client_id: GITHUB_CLIENT_ID!,
        client_secret: GITHUB_CLIENT_SECRET!,
        redirect_uri: CALLBACK_URI,
      }),
    },
  );

  const tokens = await tokenResponse.json();

  if (!tokenResponse.ok || !tokens.access_token) {
    console.error("GitHub token exchange failed:", tokens);
    return null;
  }

  const headers = {
    Authorization: `Bearer ${tokens.access_token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "expo-authentication",
  };

  const userResponse = await fetch("https://api.github.com/user", { headers });
  const userInfo = await userResponse.json();

  let email: string | undefined = userInfo.email;
  if (!email) {
    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers,
    });
    if (emailResponse.ok) {
      const emails = await emailResponse.json();
      if (Array.isArray(emails)) {
        const primary =
          emails.find((e: any) => e.primary && e.verified) ?? emails[0];
        email = primary?.email;
      }
    }
  }

  return {
    sub: String(userInfo.id),
    name: userInfo.name ?? userInfo.login,
    email: email ?? "",
    picture: userInfo.avatar_url,
  };
}

async function exchangeGoogle(
  code: string,
  codeVerifier: string | null,
): Promise<NormalizedUser | null> {
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID!,
      client_secret: GOOGLE_CLIENT_SECRET!,
      redirect_uri: CALLBACK_URI,
      grant_type: "authorization_code",
      ...(codeVerifier && { code_verifier: codeVerifier }),
    }),
  });

  const tokens = await tokenResponse.json();

  if (!tokenResponse.ok || !tokens.access_token) {
    console.error("Google token exchange failed:", tokens);
    return null;
  }

  const userResponse = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    },
  );

  const userInfo = await userResponse.json();

  return {
    sub: String(userInfo.sub),
    name: userInfo.name,
    email: userInfo.email,
    picture: userInfo.picture,
  };
}
