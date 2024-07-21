'use strict';

const serverless = require('serverless-http');
const express = require('express');
const upload = require('../config/multer');
const S3 = require('../config/s3');
const fs = require('fs');
const { AWS_S3_BUCKET_NAME } = require('../config/envs');
const deleteTemporaryFiles = require('../utils/delete-temporary-files');
const generateVideoPoster = require('../utils/generate-video-poster');
const generateVideoThumbnail = require('../utils/generate-video-thumbnail');

const app = express()
	.use(express.json())
	.use(express.urlencoded({ extended: true }));

app.post('/api/upload', upload.any('files'), async (request, response) => {
	const generatePosterAndThumbnailPromises = request.files.reduce(
		(acc, file) => {
			if (file.mimetype.match(/video/g)) {
				acc.push(
					generateVideoPoster(file.filename, file.path, file.destination),
					generateVideoThumbnail(file.filename, file.path, file.destination)
				);
			}

			return acc;
		},
		[]
	);

	await Promise.all(generatePosterAndThumbnailPromises).catch((e) => {
		console.error(e);

		return response.status(400).json(e);
	});

	const s3 = S3.create();
	const dir = '/tmp/uploads/';
	const files = fs.readdirSync(dir).map((file) => `${dir}${file}`);

	return await s3
		.uploadToS3(files, AWS_S3_BUCKET_NAME)
		.then((res) => {
			deleteTemporaryFiles(files);

			return response.status(200).json(res);
		})
		.catch((e) => {
			deleteTemporaryFiles(files);
			console.log(e);
			return response.status(400).json(e);
		});
});

exports.http = serverless(app);
