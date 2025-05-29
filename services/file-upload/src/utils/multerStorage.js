const multer = require('multer');
const path = require('path');

const { PATHS } = require("../constants/index")

const storage = multer.diskStorage({
    destination: PATHS.UPLOADS,
    filename: (_, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

module.exports = upload;
