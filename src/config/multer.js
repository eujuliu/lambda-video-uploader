const multer = require('multer');
const fs = require('fs');

const upload = multer({
	limits: {
		fileSize: 70 * 1024 * 1024,
	},
	storage: multer.diskStorage({
		destination(request, file, cb) {
			const dir = '/tmp/uploads';
			if (fs.existsSync(dir)) {
				const files = fs.readdirSync(dir);
				files.forEach((file) => fs.unlinkSync(`${dir}/${file}`));
			}

			if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

			cb(null, dir);

			return dir;
		},
		filename(request, file, cb) {
			const id = crypto.randomUUID();
			let extension = file.originalname.split('.');
			extension = extension[extension.length - 1];

			cb(null, `${id}.${extension}`);

			return `${id}.${extension}`;
		},
	}),
});

module.exports = upload;
