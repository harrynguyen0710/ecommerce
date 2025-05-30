const fs = require("fs");
const csv = require("csv-parser");

function parseCSV(filePath, onRow) {
  return new Promise((resolve, reject) => {
    const promises = [];
    let success = 0;
    let failed = 0;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const p = onRow(row)
          .then(() => success++)
          .catch(() => failed++);
        promises.push(p);
      })
      .on("end", async () => {
        await Promise.allSettled(promises);
        resolve({ success, failed });
      })
      .on("error", reject);
  });
}

module.exports = { parseCSV }