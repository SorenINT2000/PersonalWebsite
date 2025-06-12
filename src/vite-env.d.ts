/// <reference types="vite/client" />

import { Timestamp } from 'firebase/firestore';

export type Project = {
  title: string;
  type: string;
  description: string;
  details: string;
  timestamp: Timestamp;
  src: string;
  link: string;
}

export type Artwork = {
  name: string;
  src: string;
  onClick: () => void;
}

// Example of declaring types for environment variables
interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_FIREBASE_MEASUREMENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.mp3' {
  const src: string
  export default src
}