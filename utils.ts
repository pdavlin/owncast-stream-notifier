export function containsAnyWord(str: string, wordList: string[]) {
  for (let i = 0; i < wordList.length; i++) {
    if (str.includes(wordList[i])) {
      return true;
    }
  }
  return false;
}