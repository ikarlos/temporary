import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Get the folder name from the request body or query parameters
        const folderName = req.body.fullName || req.query.fullname || "defaultFolder";
        const destinationPath = `./src/public/${folderName}`;
        // console.log(destinationPath);
        if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath);
          }

        // Construct the destination path
        

        // Call the callback with the constructed path
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        const originalname = file.originalname;
        const extension = originalname.slice((originalname.lastIndexOf(".") - 1 >>> 0) + 2); // Extract the file extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension);
    }
});

export const upload = multer({
    storage,
});
