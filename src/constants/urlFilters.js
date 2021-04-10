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

const urlFilters = {
  youtubeHome: youtubeHomeFilter,
  youtubeWatch: youtubeWatchFilter,
  youtubeChannel: youtubeChannelFilter,
}

export default urlFilters