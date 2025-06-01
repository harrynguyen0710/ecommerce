function logMessagesTracing(total, failed) {
  console.log(
    `✅ Finished. Success: ${total - failed.length}, Failed: ${failed.length}`
  );

  if (failed.length > 0) {
    console.warn("⚠️ Failed Records:");
    failed.forEach(({ index, product }) => {
      console.warn(` - Index ${index}: ${JSON.stringify(product)}`);
    });
  }
}

module.exports = logMessagesTracing;
