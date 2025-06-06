// src/polling-helper.ts
async function polling(options) {
  const {
    checkFn,
    isDone,
    isFailed,
    onError,
    maxAttempts = 100,
    intervalMs = 1e4,
    sleepFn
  } = options;
  let attempt = 0;
  while (attempt < maxAttempts) {
    try {
      const res = await checkFn();
      if (isDone(res)) {
        return res;
      }
      if (isFailed && isFailed(res)) {
        throw new Error("Polling failed (isFailed)");
      }
    } catch (err) {
      if (onError && onError(err)) {
        throw err;
      }
    }
    attempt++;
    if (sleepFn) {
      await sleepFn(intervalMs);
    } else {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }
  throw new Error("\u23F0 Not ready after max polling attempts");
}

export {
  polling
};
