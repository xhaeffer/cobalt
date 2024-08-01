export const testers = {
    "bilibili": (patternMatch) =>
        patternMatch.comId?.length <= 12 || patternMatch.comShortLink?.length <= 16
        || patternMatch.tvId?.length <= 24,

    "dailymotion": (patternMatch) => patternMatch.id?.length <= 32,
    "instagram": (patternMatch) =>
        patternMatch.postId?.length <= 12
        || (patternMatch.username?.length <= 30 && patternMatch.storyId?.length <= 24),

    "loom": (patternMatch) =>
        patternMatch.id?.length <= 32,

    "ok": (patternMatch) =>
        patternMatch.id?.length <= 16,

    "pinterest": (patternMatch) =>
        patternMatch.id?.length <= 128 || patternMatch.shortLink?.length <= 32,
    "reddit": (patternMatch) =>
        (patternMatch.sub?.length <= 22 && patternMatch.id?.length <= 10)
        || (patternMatch.user?.length <= 22 && patternMatch.id?.length <= 10),

    "rutube": (patternMatch) =>
        (patternMatch.id?.length === 32 && patternMatch.key?.length <= 32) ||
        patternMatch.id?.length === 32 || patternMatch.yappyId?.length === 32,

    "soundcloud": (patternMatch) =>
        (patternMatch.author?.length <= 255 && patternMatch.song?.length <= 255)
        || patternMatch.shortLink?.length <= 32,

    "snapchat": (patternMatch) =>
        (patternMatch.username?.length <= 32 && (!patternMatch.storyId || patternMatch.storyId?.length <= 255)) 
        || patternMatch.spotlightId?.length <= 255 
        || patternMatch.shortLink?.length <= 16,

    "streamable": (patternMatch) =>
        patternMatch.id?.length === 6,

    "tiktok": (patternMatch) =>
        patternMatch.postId?.length <= 21 || patternMatch.id?.length <= 13,

    "tumblr": (patternMatch) =>
        patternMatch.id?.length < 21
        || (patternMatch.id?.length < 21 && patternMatch.user?.length <= 32),
    "twitch": (patternMatch) =>
        patternMatch.channel && patternMatch.clip?.length <= 100,
    "twitter": (patternMatch) =>
        patternMatch.id?.length < 20,
    "vimeo": (patternMatch) =>
        patternMatch.id?.length <= 11
        && (!patternMatch.password || patternMatch.password.length < 16),
    "vine": (patternMatch) =>
        patternMatch.id?.length <= 12,
    "vk": (patternMatch) =>
        patternMatch.userId?.length <= 10 && patternMatch.videoId?.length <= 10,

    "youtube": (patternMatch) =>
        patternMatch.id?.length <= 11,

    "facebook": (patternMatch) =>
        patternMatch.shortLink?.length <= 11
        || patternMatch.username?.length <= 30
        || patternMatch.caption?.length <= 255
        || patternMatch.id?.length <= 20 && !patternMatch.shareType
        || patternMatch.id?.length <= 20 && patternMatch.shareType?.length === 1,
}
