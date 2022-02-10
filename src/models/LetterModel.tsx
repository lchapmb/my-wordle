export default class LetterModel {
  letter: string;
  isWrong: boolean;
  isCorrect: boolean;
  isUsed: boolean;

  constructor(letter: string) {
    this.letter = letter;
    this.isWrong = false;
    this.isCorrect = false;
    this.isUsed = false;
  }
}
