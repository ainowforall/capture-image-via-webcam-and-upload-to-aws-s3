const express = require("express");
const app = express();
const aws = require("aws-sdk");
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create S3 instance
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

const uploadFile = (body) => {
  const buf = Buffer.from(body.replace(/^data:image\/\w+;base64,/, ""),'base64')

  const params = {
    ACL: "public-read",
    Bucket: "ainow-storage",
    Body: buf,
    Key: `avatar.jpeg`,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg'
  };
  return s3.putObject(params).promise();
};

app.post("/uploads", async (req, res) => {
  try {
    await uploadFile(req.body.b64Image);
    res.json({
      success: true,
    });
  }
  catch(error) {
    res.json({
      success: false,
      message: error
    })
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
