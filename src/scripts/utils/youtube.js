export const getAllVideosOnHomePage = () => {
  const contents = document.getElementById('contents')
  return contents.getElementsByTagName('ytd-rich-item-renderer')
}

export const getVideoChannel = (videoMetaData) => {
  return videoMetaData.querySelector('#channel-name').querySelector('#text-container').textContent.trim()
}

export const getVideoTitle = (videoMetaData) => {
  return videoMetaData.querySelector('#video-title').textContent.trim()
}