/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TITLE: string;
  readonly VITE_SUBTITLE: string;
  readonly VITE_TAGLINE: string;
  readonly VITE_WELCOME_HEADING: string;
  readonly VITE_WELCOME_SUBHEADING: string;
  readonly VITE_WELCOME_DESCRIPTION: string;
  readonly VITE_WELCOME_BUTTON: string;
  readonly VITE_LETTER_PARA_1: string;
  readonly VITE_LETTER_PARA_2: string;
  readonly VITE_LETTER_PARA_3: string;
  readonly VITE_LETTER_PARA_4: string;
  readonly VITE_LETTER_GREETING: string;
  readonly VITE_LETTER_SIGNOFF: string;
  readonly VITE_PROMISE_1: string;
  readonly VITE_PROMISE_2: string;
  readonly VITE_PROMISE_3: string;
  readonly VITE_PROMISE_4: string;
  readonly VITE_PROMISE_5: string;
  readonly VITE_MEMORY_1_TITLE: string;
  readonly VITE_MEMORY_1_DESC: string;
  readonly VITE_MEMORY_1_TAG: string;
  readonly VITE_MEMORY_2_TITLE: string;
  readonly VITE_MEMORY_2_DESC: string;
  readonly VITE_MEMORY_2_TAG: string;
  readonly VITE_MEMORY_3_TITLE: string;
  readonly VITE_MEMORY_3_DESC: string;
  readonly VITE_MEMORY_3_TAG: string;
  readonly VITE_ORBIT_1: string;
  readonly VITE_ORBIT_2: string;
  readonly VITE_ORBIT_3: string;
  readonly VITE_ORBIT_4: string;
  readonly VITE_PLAYLIST: string;
  readonly VITE_DEFAULT_IMAGES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'vite/client' {
  interface ImportMetaEnv {
    readonly VITE_TITLE: string;
    readonly VITE_SUBTITLE: string;
    readonly VITE_TAGLINE: string;
    readonly VITE_WELCOME_HEADING: string;
    readonly VITE_WELCOME_SUBHEADING: string;
    readonly VITE_WELCOME_DESCRIPTION: string;
    readonly VITE_WELCOME_BUTTON: string;
    readonly VITE_LETTER_PARA_1: string;
    readonly VITE_LETTER_PARA_2: string;
    readonly VITE_LETTER_PARA_3: string;
    readonly VITE_LETTER_PARA_4: string;
    readonly VITE_LETTER_GREETING: string;
    readonly VITE_LETTER_SIGNOFF: string;
    readonly VITE_PROMISE_1: string;
    readonly VITE_PROMISE_2: string;
    readonly VITE_PROMISE_3: string;
    readonly VITE_PROMISE_4: string;
    readonly VITE_PROMISE_5: string;
    readonly VITE_MEMORY_1_TITLE: string;
    readonly VITE_MEMORY_1_DESC: string;
    readonly VITE_MEMORY_1_TAG: string;
    readonly VITE_MEMORY_2_TITLE: string;
    readonly VITE_MEMORY_2_DESC: string;
    readonly VITE_MEMORY_2_TAG: string;
    readonly VITE_MEMORY_3_TITLE: string;
    readonly VITE_MEMORY_3_DESC: string;
    readonly VITE_MEMORY_3_TAG: string;
    readonly VITE_ORBIT_1: string;
    readonly VITE_ORBIT_2: string;
    readonly VITE_ORBIT_3: string;
    readonly VITE_ORBIT_4: string;
    readonly VITE_PLAYLIST: string;
    readonly VITE_DEFAULT_IMAGES: string;
  }
}