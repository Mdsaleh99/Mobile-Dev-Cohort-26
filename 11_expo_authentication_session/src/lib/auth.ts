import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { Pool } from "pg";
export const auth = betterAuth({
  plugins: [expo()],
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
  account: {
    accountLinking: {
      enabled: true,

      trustedProviders: ["google", "github", "email-password"],
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  trustedOrigins: [
    "expoauthenticationsession://",

    ...(process.env.NODE_ENV === "development"
      ? [
          "exp://", // Trust all Expo URLs (prefix matching)
          "exp://**", // Trust all Expo URLs (wildcard matching)
          "exp://192.168.*.*:*/**", // Trust 192.168.x.x IP range with any port and path
        ]
      : []),
  ],
});
