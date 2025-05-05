import { SourceType } from "../enums/source-type.enum";

export const getVideoSourceByUrl = (url: string): SourceType => {
    if (url.includes("youtube") || url.includes("youtu.be")) {
        return SourceType.YOUTUBE;
      } else if (url.includes("facebook")) {
        return SourceType.FACEBOOK;
      } else if (url.includes("vimeo")) {
        return SourceType.VIMEO;
      } else if (url.includes("pornhub")) {
        return SourceType.PORNHUB;
      } else {
        return SourceType.UNKNOWN;
      }
}

export const bytesToSize = (bytes: number) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
}