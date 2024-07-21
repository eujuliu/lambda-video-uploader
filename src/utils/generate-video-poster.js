const { exec } = require('child_process');

function generateVideoPoster(videoName, input, destinationDir) {
	return new Promise((resolve, reject) => {
		const id = videoName.split('.')[0];
		const output = `${destinationDir}/poster-${id}.jpg`;

		exec(`ffmpeg -i ${input} -frames:v 1 ${output}`, (error) => {
			if (error) {
				return reject({
					...error,
					ok: false,
				});
			}

			return resolve({
				message: 'Poster created with success!',
				ok: true,
			});
		});
	});
}

module.exports = generateVideoPoster;
