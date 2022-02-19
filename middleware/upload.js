// const util = require("util");
// const multer = require("multer");
// const { GridFsStorage } = require("multer-gridfs-storage");
// const dbConfig = require("../config/db");

// var storage = new GridFsStorage({
//   url: dbConfig.url + dbConfig.database,
//   options: { useNewUrlParser: true, useUnifiedTopology: true },
//   file: (req, file) => {
//     const match = ["image/png", "image/jpeg"];

//     if (match.indexOf(file.mimetype) === -1) {
//       const filename = `${Date.now()}-bezkoder-${file.originalname}`;
//       return filename;
//     }

//     return {
//       bucketName: dbConfig.imgBucket,
//       filename: `${Date.now()}-bezkoder-${file.originalname}`
//     };
//   }
// });

// var uploadFiles = multer({ storage: storage }).single("file");
// var uploadFilesMiddleware = util.promisify(uploadFiles);
// module.exports = uploadFilesMiddleware;





// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCtRA-xGs_hsHF-aCX6r6CUsn0tRQFurTM",
//   authDomain: "facebook-sale-support-system.firebaseapp.com",
//   projectId: "facebook-sale-support-system",
//   storageBucket: "facebook-sale-support-system.appspot.com",
//   messagingSenderId: "95242911425",
//   appId: "1:95242911425:web:072f2dfb12a6bd74059e40",
//   measurementId: "G-SSYJW9HDDY"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const firebaseAdmin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

const serviceAccount = require('../config/firebase_config.json');
const admin = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  storageBucket: 'gs://facebook-sale-support-system.appspot.com'
});
// const storageRef = admin.storage().bucket(`gs://facebook-sale-support-system.appspot.com/`);
const bucket = admin.storage().bucket()
async function uploadFile(path, filename) {
  // return storageRef.upload(path, {
  //   public: true,
  //   destination: `/uploads/hashnode/${filename}`,
  //   metadata: {
  //     firebaseStorageDownloadTokens: uuidv4(),
  //   }
  // });
}
async function uploadImage(file,fileBuffer) {
  console.log("File buffer: ", fileBuffer)
  const blob = bucket.file(file.originalname);
  const blobWriter = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype
    }
  })
  blobWriter.on('error', (err) => {
    console.log(err)
  })
  blobWriter.on('finish', (data) => {
    console.log("File uploaded: ", data)
  })
  blobWriter.end(fileBuffer)
  // const storage = await bucket.upload(file.path, {
  //   public: true,
  //   // destination: `/${file.filename}`,
  //   metadata: {
  //     firebaseStorageDownloadTokens: uid,
  //     contentType: file.mimetype
  //   }
  // });
  // // console.log(storage[0].metadata)
  // return storage[0].metadata.mediaLink;
}

module.exports = { uploadFile, uploadImage }