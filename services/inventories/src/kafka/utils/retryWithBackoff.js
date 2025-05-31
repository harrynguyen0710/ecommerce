async function retryWithBackoff(task, { retries = 5, delay = 1000, onRetry }) {
    let attempt = 0;

    while (attempt < retries) {
        try {
            return await task();
        } catch (error) {
            attempt++;
            
            if (onRetry) onRetry(error, attempt);

            if (attempt < retries) {
                await new Promise((r) => setTimeout(r, delay * attempt));
            }

        }
    }

    throw new Error(`Failed after ${retries} attempts`);

}

module.exports = {
    retryWithBackoff,
}