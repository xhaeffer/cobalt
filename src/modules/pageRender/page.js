import { services as s, version, repo, donations, supportedAudio, links, env } from "../config.js";
import { getCommitInfo } from "../sub/currentCommit.js";
import loc from "../../localization/manager.js";
import emoji from "../emoji.js";
import changelogManager from "../changelog/changelogManager.js";

import {
    checkbox,
    collapsibleList,
    explanation,
    footerButtons,
    multiPagePopup,
    popup,
    popupWithBottomButtons, 
    sep,
    settingsCategory,
    switcher,
    socialLink,
    socialLinks,
    urgentNotice,
    keyboardShortcuts,
    webLoc,
    sponsoredList,
    betaTag,
    linkSVG
} from "./elements.js";

let com = getCommitInfo();

let enabledServices = Object.keys(s).filter(p => s[p].enabled).sort().map((p) => {
    return `<br>&bull; ${s[p].alias ? s[p].alias : p}`
}).join('').substring(4)

let donate = ``
let donateLinks = ``
let audioFormats = supportedAudio.map((p) => {
    return { "action": p }
})
audioFormats.unshift({ "action": "best" })
for (let i in donations["links"]) {
    donateLinks += `<a id="don-${i}" class="switch autowidth" href="${donations["links"][i]}" target="_blank">REPLACEME ${i}</a>`
}
let extr = ''
for (let i in donations["crypto"]) {
    donate += `<div class="subtitle${extr}">${i} (REPLACEME)</div><div id="don-${i}" class="text-to-copy" onClick="copy('don-${i}')">${donations["crypto"][i]}</div>`
    extr = ' top-margin'
}

export default function(obj) {
    const t = (str, replace) => {
        return loc(obj.lang, str, replace)
    }

    audioFormats[0]["text"] = t('SettingsAudioFormatBest');

    try {
        return `
<!DOCTYPE html>
<html lang="${obj.lang}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="viewport-fit=cover, width=device-width, height=device-height, initial-scale=1, maximum-scale=1">

        <title>${t("AppTitleCobalt")}</title>

        <meta property="og:url" content="${env.webURL}">
        <meta property="og:title" content="${t("AppTitleCobalt")}">
        <meta property="og:description" content="${t('EmbedBriefDescription')}">
        <meta property="og:image" content="${env.webURL}icons/generic.png">
        <meta name="title" content="${t("AppTitleCobalt")}">
        <meta name="description" content="${t('AboutSummary')}">
        <meta name="twitter:card" content="summary">
        
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-title" content="${t("AppTitleCobalt")}">

        <link rel="icon" type="image/x-icon" href="icons/favicon.ico">
        <link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="icons/favicon-16x16.png">

        <link rel="apple-touch-icon" sizes="180x180" href="icons/apple-touch-icon.png">

        <link rel="manifest" href="manifest.webmanifest">
        <link rel="stylesheet" href="fonts/notosansmono.css">
        <link rel="stylesheet" href="cobalt.css">

        <meta name="theme-color" content="#000000">

        <link rel="preload" href="fonts/notosansmono.css" as="style">
        <link rel="preload" href="assets/meowbalt/error.png" as="image">
        <link rel="preload" href="assets/meowbalt/question.png" as="image">

        ${env.plausibleHostname ?
            `<script 
                defer 
                data-domain="${new URL(env.webURL).hostname}" 
                src="https://${env.plausibleHostname}/js/script.js"
            ></script>`
        : ''}
    </head>
    <body id="cobalt-body">
        <noscript>
            <div style="margin: 2rem;">${t('NoScriptMessage')}</div>
        </noscript>
        ${multiPagePopup({
            name: "about",
            closeAria: t('AccessibilityGoBack'),
            tabs: [{
                name: "about",
                title: `${emoji("🐲")} ${t('AboutTab')}`,
                content: popup({
                    name: "about",
                    header: {
                        aboveTitle: {
                            text: t('MadeWithLove'),
                            url: repo
                        },
                        closeAria: t('AccessibilityGoBack'),
                        title: `${emoji("🔮", 30)} ${t('TitlePopupAbout')}`
                    },
                    body: [{
                        text: t('AboutSummary')
                    }, {
                        text: collapsibleList([{
                            name: "services",
                            title: `${emoji("🔗")} ${t("CollapseServices")}`,
                            body: `${enabledServices}`
                            + `<div class="explanation embedded">${t("SupportNotAffiliated")}`
                            + `${obj.lang === "ru" ? `<br>${t("SupportMetaNoticeRU")}` : ''}`
                            + `</div>`
                            + `${t("ServicesNote")}`
                        }, {
                            name: "keyboard",
                            title: `${emoji("⌨")} ${t("CollapseKeyboard")}`,
                            body: 
                            `${t("KeyboardShortcutsIntro")}
                            ${keyboardShortcuts([{
                                items: [{
                                    combo: "Shift+D",
                                    name: t("PasteFromClipboard")
                                }, {
                                     combo: "Shift+K",
                                     name: t("ModeToggleAuto")
                                }, {
                                     combo: "Shift+L",
                                     name: t("ModeToggleAudio")
                                }]
                            }, {
                                items: [{
                                    combo: "⌘/Ctrl+V",
                                    name: t("KeyboardShortcutQuickPaste")
                                }, {
                                    combo: "Esc",
                                    name: t("KeyboardShortcutClear")
                                }, {
                                    combo: "Esc",
                                    name: t("KeyboardShortcutClosePopup")
                                }]
                            }, {
                                items: [{
                                     combo: "Shift+B",
                                     name: t("AboutTab")
                                }, {
                                     combo: "Shift+N",
                                     name: t("ChangelogTab")
                                }, {
                                    combo: "Shift+M",
                                    name: t("TitlePopupSettings")
                                }]
                            }])}`
                        }, {
                            name: "support",
                            title: `${emoji("❤️‍🩹")} ${t("CollapseSupport")}`,
                            body: `${t("SupportSelfTroubleshooting")}`
                            + `${socialLink(emoji("📢"), t("StatusPage"), links.statusPage)}`
                            + `${socialLink(emoji("🔧"), t("TroubleshootingGuide"), links.troubleshootingGuide)}`
                            + `<br>`
                            + `${t("FollowSupport")}`
                            + `${socialLinks(obj.lang)}`
                            + `<br>`
                            + `${t("SourceCode")}`
                            + `${socialLink(emoji("🐙"), repo.replace("https://github.com/", ''), repo)}`
                        }, {
                            name: "privacy",
                            title: `${emoji("🔒")} ${t("CollapsePrivacy")}`,
                            body: t("PrivacyPolicy") + `${
                                env.plausibleHostname ? `<br><br>${t("AnalyticsDescription")}` : ''
                            }`
                        }, {
                            name: "legal",
                            title: `${emoji("📑")} ${t("CollapseLegal")}`,
                            body: t("FairUse")
                        }])
                    },
                    ...(env.showSponsors ?
                    [{
                        text: t("SponsoredBy"),
                        classes: ["sponsored-by-text"],
                        nopadding: true
                    }, {
                        text: sponsoredList(),
                        raw: true
                    }] : []
                    )]
                })
            }, {
                name: "changelog",
                title: `${emoji("🎉")} ${t('ChangelogTab')}`,
                content: popup({
                    name: "changelog",
                    header: {
                        closeAria: t('AccessibilityGoBack'),
                        title: `${emoji("🪄", 30)} ${t('TitlePopupChangelog')}`
                    },
                    body: [{
                        text: `<div class="category-title">${t('ChangelogLastMajor')}</div>`,
                        raw: true
                    }, {
                        text: (() => {
                            const banner = changelogManager('banner');
                            if (!banner) return '';
                            return `<div class="changelog-banner">
                                        <img class="changelog-img" ` +
                                            `src="${banner.url}" ` +
                                            `alt="${banner.alt.replaceAll('"', '&quot;')}" ` +
                                            `width="${banner.width}" ` +
                                            `height="${banner.height}" ` +
                                            `onerror="this.style.opacity=0" loading="lazy">
                                    </div>`;
                        })(),
                        raw: true
                    }, {
                        text: changelogManager("version"),
                        classes: ["changelog-tags"],
                        nopadding: true
                    }, {
                        text: changelogManager("title"),
                        classes: ["changelog-subtitle"],
                        nopadding: true
                    }, {
                        text: changelogManager("content")
                    }, {
                        text: sep(),
                        raw: true
                    },{
                        text: `<a class="text-backdrop changelog-tag-version" href="${repo}/commit/${obj.hash}">#${obj.hash}</a>`,
                        classes: ["changelog-tags"],
                        nopadding: true
                    }, {
                        text: com[0],
                        classes: ["changelog-subtitle"],
                        nopadding: true
                    }, {
                        text: com[1]
                    }, {
                        text: `<div class="category-title">${t('ChangelogOlder')}</div>`,
                        raw: true
                    }, {
                        text: `
                        <div id="changelog-history">
                            <button class="switch bottom-margin" onclick="loadOnDemand('changelog-history', '0')">${t("ChangelogPressToExpand")}</button>
                        </div>`,
                        raw: true
                    }]
                })
            }, {
                name: "donate",
                title: `${emoji("💖")} ${t('DonationsTab')}`,
                content: popup({
                    name: "donate",
                    header: {
                        closeAria: t('AccessibilityGoBack'),
                        title: emoji("💸", 30) + t('TitlePopupDonate')
                    },
                    body: [{
                        text: `<div class="category-title">${t('DonateSub')}</div>`,
                        raw: true
                    }, {
                        text: `
                        <div class="changelog-banner">
                            <img class="changelog-img" ` +
                                `src="updateBanners/catsleep.webp" ` +
                                `alt="${t("DonateImageDescription")}" ` +
                                `width="480" ` +
                                `height="270" ` +
                                `onerror="this.style.opacity=0" loading="lazy">
                        </div>`,
                        raw: true
                    }, {
                        text: t('DonateExplanation')
                    }, {
                        text: donateLinks.replace(/REPLACEME/g, t('DonateVia')),
                        raw: true
                    }, {
                        text: t('DonateLinksDescription'),
                        classes: ["explanation"]
                    }, {
                        text: sep(),
                        raw: true
                    }, {
                        text: donate.replace(/REPLACEME/g, t('ClickToCopy')),
                        classes: ["desc-padding"]
                    }]
                })
            }],
        })}
        ${multiPagePopup({
            name: "settings",
            closeAria: t('AccessibilityGoBack'),
            header: {
                aboveTitle: {
                    text: `v.${version}-${obj.hash} (${obj.branch})`,
                    url: `${repo}/commit/${obj.hash}`
                },
                title: `${emoji("⚙️", 30)} ${t('TitlePopupSettings')}`
            },
            tabs: [{
                name: "video",
                title: `${emoji("🎬")} ${t('SettingsVideoTab')}`,
                content: settingsCategory({
                    name: "downloads",
                    title: t('SettingsQualitySubtitle'),
                    body: switcher({
                        name: "vQuality",
                        explanation: t('SettingsQualityDescription'),
                        items: [{
                            action: "max",
                            text: "8k+"
                        }, {
                            action: "2160",
                            text: "4k"
                        }, {
                            action: "1440",
                            text: "1440p"
                        }, {
                            action: "1080",
                            text: "1080p"
                        }, {
                            action: "720",
                            text: "720p"
                        }, {
                            action: "480",
                            text: "480p"
                        }, {
                            action: "360",
                            text: "360p"
                        }, {
                            action: "240",
                            text: "240p"
                        }, {
                            action: "144",
                            text: "144p"
                        }]
                    })
                })
                + settingsCategory({
                    name: "codec",
                    title: t('SettingsCodecSubtitle'),
                    body: switcher({
                        name: "vCodec",
                        explanation: t('SettingsCodecDescription'),
                        items: [{
                            action: "h264",
                            text: "h264 (mp4)"
                        }, {
                            action: "av1",
                            text: "av1 (mp4)"
                        }, {
                            action: "vp9",
                            text: "vp9 (webm)"
                        }]
                    })
                })
                + settingsCategory({
                    name: "twitter",
                    title: "twitter",
                    body: checkbox([{
                        action: "twitterGif",
                        name: t("SettingsTwitterGif"),
                        padding: "no-margin"
                    }])
                    + explanation(t('SettingsTwitterGifDescription'))
                })
                + settingsCategory({
                    name: "tiktok",
                    title: "tiktok",
                    body: checkbox([{
                        action: "tiktokH265",
                        name: t("SettingsTikTokH265"),
                        padding: "no-margin"
                    }])
                    + explanation(t('SettingsTikTokH265Description'))
                })
            }, {
                name: "audio",
                title: `${emoji("🎶")} ${t('SettingsAudioTab')}`,
                content: settingsCategory({
                    name: "general",
                    title: t('SettingsFormatSubtitle'),
                    body: switcher({
                        name: "aFormat",
                        explanation: t('SettingsAudioFormatDescription'),
                        items: audioFormats
                    })
                    + sep(0)
                    + checkbox([{
                        action: "muteAudio",
                        name: t("SettingsVideoMute"),
                        padding: "no-margin"
                    }])
                    + explanation(t('SettingsVideoMuteExplanation'))
                })
                + settingsCategory({
                    name: "youtube-dub",
                    title: t("SettingsAudioDub"),
                    body: checkbox([{
                        action: "ytDub",
                        name: t("SettingsYoutubeDub"),
                        padding: "no-margin"
                    }])
                    + explanation(t('SettingsYoutubeDubDescription'))
                })
                + settingsCategory({
                    name: "tiktok-audio",
                    title: "tiktok",
                    body: checkbox([{
                        action: "fullTikTokAudio",
                        name: t("SettingsAudioFullTikTok"),
                        padding: "no-margin"
                    }])
                    + explanation(t('SettingsAudioFullTikTokDescription'))
                })
            }, {
                name: "other",
                title: `${emoji("🪅")} ${t('SettingsOtherTab')}`,
                content: settingsCategory({
                    name: "appearance",
                    title: t('SettingsAppearanceSubtitle'),
                    body: switcher({
                        name: "theme",
                        items: [{
                            action: "auto",
                            text: t('SettingsThemeAuto')
                        }, {
                            action: "dark",
                            text: t('SettingsThemeDark')
                        }, {
                            action: "light",
                            text: t('SettingsThemeLight')
                        }]
                    })
                })
                + settingsCategory({
                    name: "filename",
                    title: t('FilenameTitle'),
                    body: switcher({
                        name: "filenamePattern",
                        items: [{
                            action: "classic",
                            text: t('FilenamePatternClassic')
                        }, {
                            action: "basic",
                            text: t('FilenamePatternBasic')
                        }, {
                            action: "pretty",
                            text: t('FilenamePatternPretty')
                        }, {
                            action: "nerdy",
                            text: t('FilenamePatternNerdy')
                        }]
                    })
                    + `<div id="filename-preview">
                        <div id="video-filename" class="filename-item line">
                            ${emoji('🎞️', 32, 1, 1)}
                            <div class="filename-container">
                                <div class="filename-label">${t('Preview')}</div>
                                <div id="video-filename-text"></div>
                            </div>
                        </div>
                        <div id="audio-filename" class="filename-item">
                            ${emoji('🎧', 32, 1, 1)}
                            <div class="filename-container">
                                <div class="filename-label">${t('Preview')}</div>
                                <div id="audio-filename-text"></div>
                            </div>
                        </div>
                    </div>`
                    + explanation(t('FilenameDescription'))
                })
                + settingsCategory({
                    name: "accessibility",
                    title: t('Accessibility'),
                    body: checkbox([{
                        action: "alwaysVisibleButton",
                        name: t("SettingsKeepDownloadButton"),
                        aria: t("AccessibilityKeepDownloadButton")
                    }, {
                        action: "reduceTransparency",
                        name: t("SettingsReduceTransparency")
                    }, {
                        action: "disableAnimations",
                        name: t("SettingsDisableAnimations"),
                        padding: "no-margin"
                    }])
                })
                + (() => {
                    if (env.plausibleHostname) {
                        return settingsCategory({
                            name: "privacy",
                            title: t('PrivateAnalytics'),
                            body: checkbox([{
                                action: "plausible_ignore",
                                name: t("SettingsDisableAnalytics"),
                                padding: "no-margin"
                            }])
                            + explanation(t('SettingsAnalyticsExplanation'))
                        })
                    }
                    return ''
                })()
                + settingsCategory({
                    name: "miscellaneous",
                    title: t('Miscellaneous'),
                    body: checkbox([{
                        action: "downloadPopup",
                        name: t("SettingsEnableDownloadPopup"),
                        aria: t("AccessibilityEnableDownloadPopup")
                    }, {
                        action: "disableMetadata",
                        name: t("SettingsDisableMetadata")
                    }])
                })
            }]
        })}
        ${popupWithBottomButtons({
            name: "picker",
            closeAria: t('AccessibilityGoBack'),
            header: {
                title: `${emoji("🧮", 30)} <div id="picker-title"></div>`,
                explanation: `<div id="picker-subtitle"></div>`,
            },
            buttons: [`<a id="picker-download" class="switch" target="_blank" href="/">${t('ImagePickerDownloadAudio')}</a>`],
            content: '<div id="picker-holder"></div>'
        })}
        <div id="popup-download-container" class="popup-from-bottom">
            ${popup({
                name: "download",
                standalone: true,
                buttonOnly: true,
                classes: ["small"],
                header: {
                    closeAria: t('AccessibilityGoBack'),
                    emoji: `<img class="popout-meowbalt" `
                              + `draggable="false" loading="lazy" `
                              + `alt="😿" src="assets/meowbalt/question.png">`,
                    title: t('TitlePopupDownload')
                },
                body: switcher({
                    name: "download",
                    explanation: t('DownloadPopupDescription'),
                    items: `<a id="pd-download" class="switch full" target="_blank" href="/"><span>${t('Download')}</span></a>
                    <div id="pd-share" class="switch full">${t('ShareURL')}</div>
                    <div id="pd-copy" class="switch full">${t('CopyURL')}</div>`
                }),
                buttonText: t('PopupCloseDone')
            })}
        </div>
        <div id="popup-error-container" class="popup-from-bottom">
            ${popup({
                name: "error",
                standalone: true,
                buttonOnly: true,
                classes: ["small"],
                header: {
                    emoji: `<img class="popout-meowbalt" `
                              + `draggable="false" loading="lazy" `
                              + `alt="😿" src="assets/meowbalt/error.png">`,
                },
                body: `<div id="desc-error" class="desc-padding subtext desc-error"></div>`,
                buttonText: t('ErrorPopupCloseButton')
            })}
        </div>
        <div id="popup-backdrop" onclick="hideAllPopups()"></div>
        <div id="home" style="visibility:hidden">
            ${urgentNotice({
                emoji: "🎉",
                text: t("UpdateOneMillion"),
                visible: true,
                action: "popup('about', 1, 'changelog')"
            })}
            <div id="cobalt-main-box" class="center">
                <div id="logo">${t("AppTitleCobalt")}${betaTag()}</div>
                <div id="download-area">
                    <div id="top">
                        <div id="link-icon">${linkSVG}</div>
                        <input id="url-input-area" class="mono" type="text" autocomplete="off" data-form-type="other" spellcheck="false" maxlength="256" autocapitalize="off" placeholder="${t('LinkInput')}" aria-label="${t('AccessibilityInputArea')}" oninput="button()">
                        <button id="url-clear" onclick="clearInput()" style="display:none;">x</button>
                        <input id="download-button" class="mono dontRead" onclick="download(document.getElementById('url-input-area').value)" type="submit" value="" disabled aria-label="${t('AccessibilityDownloadButton')}">
                    </div>
                    <div id="bottom">
                        <button id="paste" class="switch" onclick="pasteClipboard()" aria-label="${t('PasteFromClipboard')}">${emoji("📋", 22)} ${t('PasteFromClipboard')}</button>
                        ${switcher({
                            name: "audioMode",
                            noParent: true,
                            items: [{
                                action: "false",
                                text: `${emoji("✨")} ${t("ModeToggleAuto")}`
                            }, {
                                action: "true",
                                text: `${emoji("🎶")} ${t("ModeToggleAudio")}`
                            }]
                        })}
                    </div>
                </div>
            </div>
            <footer id="footer">
                ${footerButtons([{
                    name: "about",
                    type: "popup",
                    text: `${emoji("🐲" , 22)} ${t('AboutTab')}`,
                    aria: t('AccessibilityOpenAbout')
                }, {
                    name: "about",
                    type: "popup",
                    context: "donate",
                    text: `${emoji("💖", 22)} ${t('Donate')}`,
                    aria: t('AccessibilityOpenDonate')
                }, {
                    name: "settings",
                    type: "popup",
                    text: `${emoji("⚙️", 22)} ${t('TitlePopupSettings')}`,
                    aria: t('AccessibilityOpenSettings')
                }])}
            </footer>
        </div>
        <script>
            let defaultApiUrl = '${env.apiURL}';
            const loc = ${webLoc(t,
            [
                'ErrorNoInternet',
                'ErrorNoUrlReturned',
                'ErrorUnknownStatus',
                'ChangelogPressToHide',
                'MediaPickerTitle',
                'MediaPickerExplanationPhone',
                'MediaPickerExplanationPC',
                'FeatureErrorGeneric',
                'ClipboardErrorNoPermission',
                'ClipboardErrorFirefox',
                'DataTransferSuccess',
                'DataTransferError',
                'FilenamePreviewVideoTitle',
                'FilenamePreviewAudioTitle',
                'FilenamePreviewAudioAuthor',
                'DownloadPopupDescriptionIOS'
            ])}
        </script>
        <script src="cobalt.js"></script>
    </body>
</html>
`
    } catch (err) {
        return `${t('ErrorPageRenderFail', obj.hash)}`;
    }
}
