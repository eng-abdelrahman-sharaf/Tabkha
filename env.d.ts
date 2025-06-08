declare namespace NodeJS {
    // Extend the NodeJS ProcessEnv interface to include environment variables
    interface ProcessEnv {
        GITHUB_TOKEN: string;
        GEMINI_API_KEY: string;
        MODEL_NAME: string;
    }
}
