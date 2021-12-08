const tutorialWords = [
  'Use the search bar to find/add words',
  'Type in these boxes to edit words!',
  '                             Remove a word --->',
  'Use the buttons at the top left to sort your list',
  'Thanks for downloading blur!',
];

export default tutorialWords.map((word, i) => {
  const date = Date.now();
  return {
    word,
    lastModified: date,
    id: i,
  };
}).reverse();
