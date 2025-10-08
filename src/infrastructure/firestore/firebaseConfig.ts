import * as admin from 'firebase-admin';
import * as path from 'path';

export class FirebaseConnection {
  private static appInstance: admin.app.App;
  private static firestoreInstance: admin.firestore.Firestore;

  private constructor() {}

  static getApp(): admin.app.App {
    if (!this.appInstance) {
      const serviceAccountPath = path.join(__dirname, '../../../serviceAccountKey.json');

      this.appInstance = admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });
    }
    return this.appInstance;
  }

  static getFirestore(): admin.firestore.Firestore {
    if (!this.firestoreInstance) {
      this.getApp();
      this.firestoreInstance = admin.firestore();
    }
    return this.firestoreInstance;
  }
}
