const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const { execFile } = require('child_process');
const path = require('path');
require('dotenv').config();

// AWS SDK 구성
const REGION = process.env.AWS_REGION;
const BUCKET_NAME = process.env.BUCKET_NAME;
const FILE_KEY = process.argv[2] || "dist/main.js";
const LOCAL_FILE_PATH = path.resolve(__dirname, 'file.js');

const s3Client = new S3Client({ region: REGION });

const downloadFile = async () => {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: FILE_KEY,
    });

    try {
        const data = await s3Client.send(command);
        const writeStream = fs.createWriteStream(LOCAL_FILE_PATH);

        data.Body.pipe(writeStream);
        writeStream.on('close', () => {
            console.log(`File downloaded to ${LOCAL_FILE_PATH}`);
            execDownloadedFile();
        });

        writeStream.on('error', (err) => {
            console.error('Error writing file:', err);
        });
    } catch (err) {
        console.error('Error downloading file from S3:', err);
    }
};

const execDownloadedFile = () => {
    const child = execFile('node', [LOCAL_FILE_PATH]);

    child.stdout.on('data', (data) => {
        console.log(`Output: ${data}`);
    });

    child.stderr.on('data', (data) => {
        console.error(`Errors: ${data}`);
    });

    child.on('close', (code) => {
        console.log(`Child process exited with code ${code}`);
    });
};

downloadFile();