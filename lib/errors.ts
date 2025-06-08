export const errorToString = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    } else if (typeof error === "string") {
        return error;
    } else if (typeof error === "object" && error !== null) {
        if ("message" in error && typeof error.message === "string") {
            return error.message;
        }
        if ("error" in error && typeof error.error === "string") {
            return error.error;
        }
        return JSON.stringify(error);
    }
    return "An error occurred";
};

export const safeFetch = async (
    url: string,
    options?: RequestInit
): Promise<Response> => {
    try {
        const response = await fetch(url, options);
        return response;
    } catch (error) {
        throw new Error(`Fetch failed: ${errorToString(error)}`);
    }
};
