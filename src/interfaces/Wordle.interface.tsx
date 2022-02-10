export interface WordleInterface {
    // enforce some of the game logic
    targetWord: string;
    guessedWords: string[];
    lettersLeft: string[];
    lives: number;

    generateWordleWord(): void;
    checkIfStringIsWord(word: string): void;
}