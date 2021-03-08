import { config } from "dotenv";
config();
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FB_PROJECT_ID,
      privateKey: process.env.FB_PRIVATE_KEY,
      clientEmail: process.env.FB_CLIENT_EMAIL,
    }),
  });
}

export default admin.firestore();
