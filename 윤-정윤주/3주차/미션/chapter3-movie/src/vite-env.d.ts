/// <reference types="vite/client" />
interface ImportMeataEnv {
    readonly VITE_API_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMeataEnv;
}   