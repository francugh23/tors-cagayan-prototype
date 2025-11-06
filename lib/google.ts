import { google } from "googleapis";
import path from "path";
import { readFileSync } from "fs";

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/documents",
];

export function getGoogleAuth() {
  const keyPath = path.join(process.cwd(), "service-account.json")
  const keyFile = readFileSync(keyPath, "utf-8");
  const key = JSON.parse(keyFile);

  return new google.auth.GoogleAuth({
    credentials: key,
    scopes: GOOGLE_SCOPES,
  })
}