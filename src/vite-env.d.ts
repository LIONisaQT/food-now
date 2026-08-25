/// <reference types="vite/client" />
/// <reference types="google.maps" />

interface ImportMetaEnv {
	readonly VITE_GMAPS_API_KEY: string;
	// add other env vars here
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
