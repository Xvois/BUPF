import imageCompression from 'browser-image-compression';

type Options = {
	maxSizeMB: number,            // (default: Number.POSITIVE_INFINITY)
	maxWidthOrHeight: number,     // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight (default: undefined)
								  // but, automatically reduce the size to smaller than the maximum Canvas size supported by each browser.
								  // Please check the Caveat part for details.
	onProgress?: (progress: number) => void,         // optional, a function takes one progress argument (percentage from 0 to 100)
	useWebWorker?: boolean,        // optional, use multi-thread web worker, fallback to run in main-thread
	// (default: true)
	libURL?: string,               // optional, the libURL of this library for importing script in Web Worker
	// (default: https://cdn.jsdelivr.net/npm/browser-image-compression/dist/browser-image-compression.js)
	preserveExif?: boolean,        // optional, use preserve Exif metadata for JPEG image e.g., Camera model, Focal
	// length, etc (default: false)

	signal?: AbortSignal,          // optional, to abort / cancel the compression

	maxIteration?: number,         // optional, max number of iteration to compress the image (default: 10)
	exifOrientation?: number,      // optional, see https://stackoverflow.com/a/32490603/10395024
	fileType?: string,             // optional, fileType override e.g., 'image/jpeg', 'image/png' (default: file.type)
	initialQuality?: number,       // optional, initial quality value between 0 and 1 (default: 1)
	alwaysKeepResolution?: boolean // optional, only reduce quality, always keep width and height (default: false)
}

export default async function resizeImage(file: File, options?: Options) {
	const controller = new AbortController();

	const defaultOptions = {
		maxSizeMB: 1,
		maxWidthOrHeight: 1920,
		preserveExif: true,
		signal: controller.signal,
		maxIteration: 10,
		exifOrientation: 1,
		fileType: file.type,
		initialQuality: 1,
		alwaysKeepResolution: false,
	}

	// Abort the compression after 1.5 seconds
	setTimeout(function () {
		controller.abort(new Error('Compression exceeded allotted time.'));
	}, 1500);

	return await imageCompression(file, options ? {...options, signal: controller.signal} : defaultOptions);
}