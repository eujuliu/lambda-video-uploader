const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const {
	AWS_S3_ACCESS_KEY_ID,
	AWS_S3_REGION,
	AWS_S3_SECRET_ACCESS_KEY,
} = require('./envs');
const fs = require('fs');
const getFileMetadata = require('../utils/get-file-metadata');

class S3 {
	_s3;
	constructor(config) {
		this._s3 = new S3Client({
			apiVersion: 'latest',
			region: AWS_S3_REGION,
			credentials: {
				accessKeyId: AWS_S3_ACCESS_KEY_ID,
				secretAccessKey: AWS_S3_SECRET_ACCESS_KEY,
			},
			...config,
		});
	}

	static create(config = {}) {
		const client = new S3(config);

		return client;
	}

	uploadToS3(files, bucket) {
		const putObjectPromises = files.reduce((acc, file) => {
			if (typeof file === 'string') file = getFileMetadata(file);
			acc.push(
				this._s3.send(
					new PutObjectCommand({
						Bucket: bucket,
						Key: file.filename,
						Body: fs.readFileSync(file.path),
						ACL: 'public-read',
						ContentType: file.mimetype,
						Metadata: {
							...file,
						},
					})
				)
			);

			return acc;
		}, []);

		return Promise.all(putObjectPromises);
	}
}

module.exports = S3;
