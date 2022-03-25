import axios from "axios";

export abstract class WordleController {
  static alphabet: string[] = Array.from(Array(26))
    .map((e, i) => i + 65)
    .map((x) => String.fromCharCode(x)); // the alphabet

  static generateWordleWord = async () => {
    const res = await axios.get(
      `https://api.github.com/gists/fe2b58729defad2ace4d70957d221dcb`
    );
    const clue = res.data.files.wordleClue.content;
    return clue;
  };

  static generatePubName = async () => {
    const res = await axios.get(
      `https://api.github.com/gists/7e702d2d3cc93feef867b1b258aa01f2`
    );
    const pub = res.data.files.pub.content;
    return pub;
  };

  static checkIfStringIsWord = async (word: string) => {
    // check if the string given is a word

    // if the word is untruthy then return false
    if (!word) return false;

    // convert to lowercase
    word = word.toLowerCase();

    // if the string contains a string then remove everything after the first space
    if (word.includes(" ")) word = word.split(" ")[0];

    const res = await axios.get(
      `https://api.datamuse.com/words?sp=${word}&md=d&max=1`
    );

    if (res.data.length === 0) return false;

    let isWord = false;

    for (let i = 0; i < res.data.length; i++) {
      if (res.data[i].word === word) {
        isWord = true;
        break;
      }
    }

    return isWord;
  };

  static deleteLastLetterFromDisplayGrid = async (
    displayGrid: any[],
    currentRow: number
  ) => {
    return displayGrid.map((row, i) => {
      if (i === currentRow) {
        return row.map((letter: string, j: number) => {
          if (letter === "") {
            return letter;
          }
          return letter;
        });
      }
      return row;
    });
  };
}
