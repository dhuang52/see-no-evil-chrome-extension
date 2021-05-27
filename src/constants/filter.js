const youtubeHomeFilter = {
  url: [ {hostContains: '.youtube.com', urlSuffix: '.com/'} ]
}
const youtubeWatchFilter = {
  url: [ {hostContains: '.youtube.com', pathPrefix: '/watch'} ]
}
const youtubeChannelFilter = {
  url: [
    {hostContains: '.youtube.com', pathPrefix: '/channel/'},
    {hostContains: '.youtube.com', pathPrefix: '/c/'}
  ]
}

export const urlFilters = {
  youtubeHome: youtubeHomeFilter,
  youtubeWatch: youtubeWatchFilter,
  youtubeChannel: youtubeChannelFilter,
}

export const matchPatterns = {
  youtube: '*://*.youtube.com/',
  youtubeBrowse: '*://*.youtube.com/youtubei/v1/browse?key=*',
  youtubeNext: '*://*.youtube.com/youtubei/v1/next?key=*'
}