import {
    BASE_URL,
    GITHUB_AUTH_URL,
    GITHUB_CLIENT_ID,
    GOOGLE_AUTH_URL,
    GOOGLE_CLIENT_ID,
} from "@/constants";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const provider = url.searchParams.get("provider") ?? "google";
  const redirectUri = url.searchParams.get("redirect_uri");
  const state = url.searchParams.get("state");
  const codeChallenge = url.searchParams.get("code_challenge");
  const codeChallengeMethod = url.searchParams.get("code_challenge_method");

  if (!redirectUri || !state) {
    return Response.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  const callbackUri = `${BASE_URL}/api/auth/callback`;

  if (provider === "github") {
    if (!GITHUB_CLIENT_ID) {
      return Response.json(
        { error: "Missing GitHub client id" },
        { status: 400 },
      );
    }

    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: callbackUri,
      scope: "read:user user:email",
      state,
      allow_signup: "true",
    });

    return Response.redirect(`${GITHUB_AUTH_URL}?${params.toString()}`);
  }

  if (!GOOGLE_CLIENT_ID) {
    return Response.json(
      { error: "Missing Google client id" },
      { status: 400 },
    );
  }

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: callbackUri,
    response_type: "code",
    scope: "openid profile email",
    state,
    prompt: "select_account",
    ...(codeChallenge && { code_challenge: codeChallenge }),
    ...(codeChallengeMethod && { code_challenge_method: codeChallengeMethod }),
  });

  return Response.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
}
