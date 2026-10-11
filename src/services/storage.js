import { storage, isValidConfig } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const storageService = {
  /**
   * Uploads a file to Firebase Storage or generates a local blob URL in fallback mode.
   * @param {File} file The file object to upload
   * @param {string} path The destination folder/path in storage (e.g., 'assignments/123/submission.pdf')
   * @returns {Promise<string>} The downloadable URL of the file
   */
  async uploadFile(file, path) {
    if (isValidConfig && storage) {
      try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        return downloadUrl;
      } catch (error) {
        console.error("Firebase upload failed, falling back to local Blob URL:", error);
        return URL.createObjectURL(file);
      }
    } else {
      // In local mode, return a local object URL that works instantly in the browser
      console.log(`Mocking file upload for ${file.name} to ${path}`);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(file));
        }, 1200); // Simulate network delay
      });
    }
  }
};
