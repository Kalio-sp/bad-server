import "dotenv/config";

const {
  DB_ADDRESS = "mongodb://localhost:27017/weblarek",
  AUTH_ACCESS_TOKEN_SECRET,
  AUTH_REFRESH_TOKEN_SECRET,
} = process.env;

if (!AUTH_ACCESS_TOKEN_SECRET) {
  throw new Error("AUTH_ACCESS_TOKEN_SECRET не найден в .env");
}

if (!AUTH_REFRESH_TOKEN_SECRET) {
  throw new Error("AUTH_REFRESH_TOKEN_SECRET не найден в .env");
}

export const ACCESS_TOKEN = {
  secret: AUTH_ACCESS_TOKEN_SECRET,
  expiry: "15m",
};

export const REFRESH_TOKEN = {
  secret: AUTH_REFRESH_TOKEN_SECRET,
  expiry: "7d",
  cookie: {
    name: "refreshToken",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  },
};

export { DB_ADDRESS };
