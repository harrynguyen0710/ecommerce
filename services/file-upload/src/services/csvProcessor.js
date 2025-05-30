const fs = require("fs");
const csv = require("csv-parser");

function parseCSV(filePath, onRow) {
    return new Promise((resolve, reject) => {
        let failed = 0;
        let success = 0;

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", async (row) => {
                try {
                    await onRow(row);
                    success++;
                } catch {
                    failed++;
                }
            })
            .on("end", () => resolve({ success, failed }))
            .on("error", reject);
    });
}

module.exports = { parseCSV }