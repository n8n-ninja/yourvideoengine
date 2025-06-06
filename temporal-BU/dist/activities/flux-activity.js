export async function startFlux(params) {
    const { FLUX_API_URL, FLUX_API_KEY } = process.env;
    if (!FLUX_API_URL || !FLUX_API_KEY) {
        throw new Error("Flux config missing");
    }
    const inputData = {
        model: params.model || "Qubico/flux1-dev",
        task_type: params.task_type || "txt2img",
        input: params.input,
        ...(params.negative_prompt
            ? { negative_prompt: params.negative_prompt }
            : {}),
        ...(params.denoise ? { denoise: params.denoise } : {}),
        ...(params.guidance_scale ? { guidance_scale: params.guidance_scale } : {}),
        ...(params.width ? { width: params.width } : {}),
        ...(params.height ? { height: params.height } : {}),
        ...(params.batch_size ? { batch_size: params.batch_size } : {}),
        ...(params.lora_settings ? { lora_settings: params.lora_settings } : {}),
        ...(params.control_net_settings
            ? { control_net_settings: params.control_net_settings }
            : {}),
        ...(params.config ? { config: params.config } : {}),
        ...(params.webhook_config ? { webhook_config: params.webhook_config } : {}),
        ...(params.service_mode ? { service_mode: params.service_mode } : {}),
    };
    const res = await fetch(FLUX_API_URL, {
        method: "POST",
        headers: {
            "X-API-Key": FLUX_API_KEY,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(inputData),
    });
    const data = await res.json();
    if (!data.data?.task_id) {
        console.error("❌ Erreur API Flux:", data);
        throw new Error(data?.error || `Flux API error: ${res.status}`);
    }
    return { externalId: data.data.task_id };
}
export async function checkFluxStatus(externalId) {
    const { FLUX_STATUS_URL, FLUX_API_KEY } = process.env;
    if (!FLUX_STATUS_URL || !FLUX_API_KEY) {
        throw new Error("Flux config missing");
    }
    const url = `${FLUX_STATUS_URL}/${externalId}`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "X-API-Key": FLUX_API_KEY,
            Accept: "application/json",
        },
    });
    const data = await res.json();
    const status = data.data.status;
    if (status === "completed") {
        return {
            status: "ready",
            outputData: data,
            returnData: data.data?.output?.image_url
                ? { url: data.data.output.image_url }
                : undefined,
        };
    }
    else if (status === "failed") {
        return {
            status: "failed",
            outputData: data,
            returnData: { error: "Flux processing failed" },
        };
    }
    else {
        return {
            status: "processing",
        };
    }
}
