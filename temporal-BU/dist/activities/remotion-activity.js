export async function startRemotion(params) {
    const { REMOTION_RENDER_URL } = process.env;
    if (!REMOTION_RENDER_URL) {
        throw new Error("Remotion config missing");
    }
    const { composition, inputProps, width = 1920, height = 1080, fps = 30, durationInFrames = 300, } = params;
    const payload = {
        composition,
        inputProps,
        width,
        height,
        fps,
        durationInFrames,
    };
    const res = await fetch(REMOTION_RENDER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.renderId) {
        console.error("❌ Erreur API Remotion:", data);
        throw new Error(data?.error || `Remotion API error: ${res.status}`);
    }
    return { renderId: data.renderId, bucketName: data.bucketName };
}
export async function checkRemotionStatus(renderId, bucketName) {
    const { REMOTION_STATUS_URL } = process.env;
    if (!REMOTION_STATUS_URL) {
        throw new Error("Remotion config missing");
    }
    const url = `${REMOTION_STATUS_URL}?renderId=${renderId}&bucketName=${encodeURIComponent(bucketName)}`;
    const res = await fetch(url);
    const data = JSON.parse(await res.text());
    let failed = false;
    let errorDetails = null;
    if (Array.isArray(data.errors) && data.errors.some((e) => e.isFatal)) {
        failed = true;
        errorDetails = data.errors.filter((e) => e.isFatal);
    }
    if (data.done && !failed) {
        return {
            status: "done",
            url: data.outputFile,
        };
    }
    else if (failed) {
        return {
            status: "failed",
            errors: errorDetails,
        };
    }
    else {
        return {
            status: "pending",
        };
    }
}
