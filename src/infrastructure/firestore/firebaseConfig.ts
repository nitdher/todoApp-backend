import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

export class FirebaseConnection {
  private static appInstance: admin.app.App;
  private static firestoreInstance: admin.firestore.Firestore;

  private constructor() {}

  static getApp(): admin.app.App {
    if (!this.appInstance) {
      const serviceAccountPath = path.join(__dirname, '../../../serviceAccountKey.json');

      // En Cloud Functions, no existe el archivo y se usan credenciales automáticas
      // En desarrollo local, se usa el serviceAccountKey.json
      if (fs.existsSync(serviceAccountPath)) {
        this.appInstance = admin.initializeApp({
          credential: admin.credential.cert(serviceAccountPath),
        });
      } else {
        // Cloud Functions: credenciales automáticas
        this.appInstance = admin.initializeApp();
      }
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
