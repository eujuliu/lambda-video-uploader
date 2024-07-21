const path = require('path');
const mime = require('mime-types');

function getFileMetadata(filepath) {
	return {
		filename: `${path.parse(filepath).name}${path.parse(filepath).ext}`,
		path: filepath,
		mimetype: mime.lookup(filepath),
	};
}

module.exports = getFileMetadata;
