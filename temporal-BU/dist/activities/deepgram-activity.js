import { ApplicationFailure } from "@temporalio/common";
export async function runDeepgram(params) {
    const { DEEPGRAM_URL, DEEPGRAM_API_KEY } = process.env;
    if (!DEEPGRAM_URL || !DEEPGRAM_API_KEY) {
        throw new Error("Deepgram config missing");
    }
    const { videoUrl, language = "en", model = "nova-3", punctuate = false, keywords = [], } = params;
    const url = new URL(DEEPGRAM_URL);
    url.searchParams.set("model", model);
    url.searchParams.set("language", language);
    url.searchParams.set("punctuate", punctuate.toString());
    if (model === "nova-3" && Array.isArray(keywords)) {
        keywords.forEach((k) => url.searchParams.append("keyterm", k));
    }
    else if (keywords && Array.isArray(keywords)) {
        keywords.forEach((k) => url.searchParams.append("keywords", k));
    }
    const res = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Token ${DEEPGRAM_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            url: videoUrl,
        }),
    });
    const data = await res.json();
    if (!res.ok) {
        console.error("❌ Erreur API Deepgram:", data);
        throw ApplicationFailure.nonRetryable(`Deepgram API error: ${res.status}`, "DeepgramAPIError", [data]);
    }
    return {
        captions: {
            transcript: data?.results?.channels?.[0]?.alternatives?.[0]?.transcript,
            words: data?.results?.channels?.[0]?.alternatives?.[0]?.words,
        },
    };
}
