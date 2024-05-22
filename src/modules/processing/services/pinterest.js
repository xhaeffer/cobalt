import { genericUserAgent } from "../../config.js";

const videoRegex = /"url":"(https:\/\/v1.pinimg.com\/videos\/.*?)"/g;
const imageRegex = /src="(https:\/\/i\.pinimg\.com\/.*\.(jpg|gif))"/g;

export default async function(o) {
    let id = o.id;

    if (!o.id && o.shortLink) {
        id = await fetch(`https://api.pinterest.com/url_shortener/${o.shortLink}/redirect/`, { redirect: "manual" })
                   .then(r => r.headers.get("location").split('pin/')[1].split('/')[0])
                   .catch(() => {});
    }
    if (id.includes("--")) id = id.split("--")[1];
    if (!id) return { error: 'ErrorCouldntFetch' };

    let html = await fetch(`https://www.pinterest.com/pin/${id}/`, {
        headers: { "user-agent": genericUserAgent }
    }).then(r => r.text()).catch(() => {});

    if (!html) return { error: 'ErrorCouldntFetch' };

    let videoLink = [...html.matchAll(videoRegex)]
                    .map(([, link]) => link)
                    .find(a => a.endsWith('.mp4') && a.includes('720p'));

    if (videoLink) return {
        urls: videoLink,
        filename: `pinterest_${o.id}.mp4`,
        audioFilename: `pinterest_${o.id}_audio`
    }

    let imageLink = [...html.matchAll(imageRegex)]
                    .map(([, link]) => link)
                    .find(a => a.endsWith('.jpg') || a.endsWith('.gif'));
                    
    if (imageLink) return {
        urls: imageLink,
        isPhoto: true
    }

    return { error: 'ErrorEmptyDownload' };
}
