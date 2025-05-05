import { Request, Response } from "express";
import { bytesToSize, getVideoSourceByUrl } from "../helpers/functions/helpers";
import youtubeDl from "youtube-dl-exec";
import { resolve } from "path";
import { map, reject } from "lodash";
import { SourceType } from "../helpers/enums/source-type.enum";

const getVideoFromLibrary = (url: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		youtubeDl(url, {
			dumpSingleJson: true,
			noCheckCertificates: true,
			noWarnings: true,
			preferFreeFormats: true,
			format: 'best',
			addHeader: ['referer:youtube.com', 'user-agent:googlebot']
		}).then((output: any) => resolve(output))
		.catch((e: any) => reject(e));
	})
}


const handleYoutubeVideo = (data: any) => {
	let formats: any[] = [];

	const requestedFormats = data?.formats || [];

	map(requestedFormats, (item) => {
		item.filesize = item.filesize ? bytesToSize(item.filesize) : "";
		if(item.vcodec !== "none" && item.acodec !== "none") {
			formats.push(item);
		}
	})

	const videoMetadata = {
		id: data?.id || "None",
		source: SourceType.YOUTUBE, 
		title: data?.title || "None",
		duration: data?.duration_string || "0:00",
		thumbnails: data?.thumbnail || "",
		formats: formats
	}

	return videoMetadata;
}

const handleFacebookVideo = (data: any) => {
	let formats: any[] = [];

	const requestedFormats = data?.formats || [];

	map(requestedFormats, (item) => {
		item.filesize = item.downloader_options?.http_chunk_size ? bytesToSize(item.downloader_options?.http_chunk_size) : "";
		if(item.vcodec !== "none" && item.acodec !== "none") {
			formats.push(item);
		}
	})

	const videoMetadata = {
		id: data?.id || "None",
		source: SourceType.FACEBOOK, 
		title: data?.title || "None",
		duration: data?.duration_string || "0:00",
		thumbnails: data?.thumbnail || "",
		formats: formats
	}

	return videoMetadata;
}

export const fetchVideo = async (request: Request, response: Response): Promise<void> => {
	const { url } = request.body;
	const source = getVideoSourceByUrl(url);

	try {
		const result = await getVideoFromLibrary(url);
		console.log("result", JSON.stringify(result, null, 2));

		switch(source) {
			case SourceType.YOUTUBE:
				response.send({
					meta: handleYoutubeVideo(result)
				})
				break;
			case SourceType.FACEBOOK:
				response.send({
					meta: handleFacebookVideo(result)
				})
				break;
			default:
				response.send({
					message: "hello world"
				});
		}
	} catch (e: any) {
		response.send({
			error: e.message
		});
	}
}
