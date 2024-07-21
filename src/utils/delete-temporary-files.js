const fs = require('fs');

function deleteTemporaryFiles(files) {
	files.forEach((file) => {
		fs.unlinkSync(file);
	});
}

module.exports = deleteTemporaryFiles;
