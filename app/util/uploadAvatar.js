const multer = require("multer");

//khoi tao multel
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './app/public');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

//binding
module.exports = multer({storage: storage});