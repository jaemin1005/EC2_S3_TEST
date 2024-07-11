import express from "express"
import dotenv from "dotenv"
import AWS from "aws-sdk";
dotenv.config();

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

const app = express();

app.get('/', (req, res) => {
  const params : AWS.S3.GetObjectRequest= {
    Bucket: process.env.BUCKET_NAME!,
    Key: "public/index.html"
  };

  s3.getObject(params, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      if (data.ContentType) {
        res.setHeader('Content-Type', data.ContentType);
      }
      res.send(data.Body);
    }
  });
})

app.listen(3000, () => {
  console.log("http://localhost:3000");
})