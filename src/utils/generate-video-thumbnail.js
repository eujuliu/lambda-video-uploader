const { exec } = require('child_process');

function generateVideoThumbnail(videoName, input, destinationDir) {
	return new Promise((resolve, reject) => {
		const id = videoName.split('.')[0];
		const output = `${destinationDir}/thumbnail-${id}.gif`;

		exec(
			`ffmpeg -ss 0 -t 4 -i ${input} -filter_complex "fps=10,scale=360:-1[s]; [s]split[a][b]; [a]palettegen[palette]; [b][palette]paletteuse" ${output}`,
			(error) => {
				if (error) {
					return reject({
						...error,
						ok: false,
					});
				}

				return resolve({
					message: 'Thumbnail created with success!',
					ok: true,
				});
			}
		);
	});
}

module.exports = generateVideoThumbnail;
