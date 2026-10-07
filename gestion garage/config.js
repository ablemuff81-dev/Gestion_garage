// ⬇️ REMPLACEZ ces valeurs par celles de VOTRE projet Firebase (Paramètres du projet > Vos applications > Config).
// Tant que apiKey vaut "REMPLACER_API_KEY", l'app tourne en MODE DÉMO (localStorage, aucune donnée envoyée).
export const firebaseConfig = {
  apiKey: "AIzaSyDlOR70DJ-tKOSrd9SoVgtxH1E-0YcyR90",
  authDomain: "gestion-garage-8aaa9.firebaseapp.com",
  projectId: "gestion-garage-8aaa9",
  storageBucket: "gestion-garage-8aaa9.firebasestorage.app",
  messagingSenderId: "690274928206",
  appId: "1:690274928206:web:e77705c7ed3ad86fc3651f",
  measurementId: "G-Q1CKRQJXR8"
};
export const isConfigured = !String(firebaseConfig.apiKey).startsWith('REMPLACER');
