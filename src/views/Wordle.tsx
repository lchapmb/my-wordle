import React from "react";

import "../css/App.css";

import { WordleController } from "../controllers/Wordle.controller";

import LetterModel from "../models/LetterModel";

import { Button, Segment, Label, Icon } from "semantic-ui-react";

function Wordle() {
  const [viewTargetWord, setViewTargetWord] = React.useState<boolean>(false);
  const [targetWord, setTargetWord] = React.useState("");
  const [displayGrid, setDisplayGrid] = React.useState(
    [0, 1, 2, 3, 4].map(() => [0, 1, 2, 3, 4].map(() => ""))
  );
  const [currentRow, setCurrentRow] = React.useState(0);
  const [letters, setLetters] = React.useState<LetterModel[]>(
    WordleController.alphabet.map(
      (letter) => new LetterModel(letter.toLowerCase())
    )
  );
  const [errorMessage, setErrorMessage] = React.useState("");
  const [targetPub, setTargetPub] = React.useState("");

  React.useEffect(() => {
    WordleController.generateWordleWord().then((word) => {
      setTargetWord(word);
    });
    WordleController.generatePubName().then((name) => {
      setTargetPub(name);
    });
  }, []);

  const handleLetterClick = (letter: LetterModel) => {
    let tempArr = [...displayGrid];
    for (let i = 0; i < tempArr[currentRow].length; i++) {
      const col = tempArr[currentRow][i];
      if (!col) {
        tempArr[currentRow][i] = letter.letter;
        break;
      }
    }
    setDisplayGrid(tempArr);
  };

  const letterBackgroundColor = (letter: string) => {
    const letterModel = letters.find((l) => l.letter === letter.toLowerCase());
    if (letterModel) {
      if (letterModel.isWrong) return "red";
      if (letterModel.isCorrect) return "green";
      if (letterModel.isUsed) return "orange";
    }
    return "";
  };

  const handleDeleteLastLetter = async () => {
    let tempArr = [...displayGrid];
    for (let i = 0; i < tempArr[currentRow].length; i++) {
      if (!tempArr[currentRow][i + 1]) {
        tempArr[currentRow][i] = "";
        break;
      }
    }
    setDisplayGrid(tempArr);
  };

  const setLetterAsUsed = (isUsedBool: boolean, gLetter: string) => {
    setLetters(
      letters.map((letter) => {
        if (letter.letter === gLetter) {
          letter.isUsed = true;
          isUsedBool = true;
        }
        return letter;
      })
    );
    return isUsedBool;
  };

  const handleSubmit = async () => {
    // check if the current word line is complete
    let tempArr = [...displayGrid];
    for (let i = 0; i < tempArr[currentRow].length; i++) {
      const col = tempArr[currentRow][i];
      if (!col) {
        setErrorMessage("Please complete the word line");
        return null;
      }
    }

    let guessString = displayGrid[currentRow].join("");

    // check if the current word is actually a word
    const isWord = await WordleController.checkIfStringIsWord(guessString);

    if (!isWord) {
      // the word is not a actual word
      setErrorMessage("That is not a word");
      return null;
    }

    // check each letter than relates to the current word line
    for (let l = 0; l < guessString.split("").length; l++) {
      let gLetter = guessString.split("")[l];
      let isCorrect = false;
      let isUsedBool = false;
      if (gLetter === targetWord.split("")[l]) {
        // the word is correct and in the correct position
        setLetters(
          letters.map((letter) => {
            if (letter.letter === gLetter) {
              letter.isCorrect = true;
              isCorrect = true;
            }
            return letter;
          })
        );
      } else {
        // check if the letter is correct but in the wrong positions
        for (let ti = 0; ti < targetWord.split("").length; ti++) {
          const targetLetter = targetWord.split("")[ti];
          if (gLetter === targetLetter) {
            isUsedBool = setLetterAsUsed(isUsedBool, gLetter);
          }
        }
      }
      if (!isCorrect && !isUsedBool) {
        // the letter is wrong and not used
        setLetters(
          letters.map((letter) => {
            if (letter.letter === gLetter) {
              letter.isWrong = true;
            }
            return letter;
          })
        );
      }
    }

    // : check if the word guessed is the target word
    if (guessString === targetWord) {
      // the word is correct
      setErrorMessage(`WINNER! Next stop: ${targetPub}`);
      setCurrentRow(currentRow + 1);
      // TODO: GAME OVER SCREEN - WINNER
      return null;
    }

    // increment the current row
    setCurrentRow(currentRow + 1);

    // check if the current row is the last row
    if (currentRow === displayGrid.length - 1) {
      // TODO: GAME OVER - LOSER
      setErrorMessage("LOSER");
      return null;
    }

    setErrorMessage("");
  };

  return (
    <div
      style={{
        backgroundColor: "#282c34",
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Segment size="massive" inverted color={errorMessage ? "red" : "green"}>
        {errorMessage ? errorMessage : "No errors"}
      </Segment>
      <Segment
        basic
        onClick={() => setViewTargetWord(!viewTargetWord)}
        style={{ cursor: "pointer" }}
      >
        <Label size="massive">
          <Icon name={viewTargetWord ? "eye slash" : "eye"} />{" "}
          {viewTargetWord ? targetWord : "View target word"}
        </Label>
      </Segment>
      <div>
        {displayGrid.map((row, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "row" }}>
            {row.map((letter: string, j: number) => (
              <div
                key={j}
                style={{
                  color: "white",
                  height: 75,
                  width: 75,
                  padding: 10,
                  margin: 10,
                  display: "flex",
                  flexDirection: "column",
                  border: (i === currentRow ? "3" : "1") + "px solid white",
                  borderRadius: "50%",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "2em",
                  fontWeight: "bold",
                  backgroundColor:
                    i === currentRow ? "" : letterBackgroundColor(letter),
                }}
              >
                {letter.toUpperCase()}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: 15,
          margin: 15,
        }}
      >
        <div style={{ textAlign: "center", width: "60%" }}>
          {letters.map((letter) => (
            <Button
              onClick={() => {
                if (!letter.isWrong) {
                  handleLetterClick(letter);
                }
              }}
              disabled={letter.isWrong}
              key={letter.letter}
              style={{ margin: 2 }}
              basic={letter.isWrong}
              color={
                letter.isWrong
                  ? "red"
                  : letter.isCorrect
                  ? "green"
                  : letter.isUsed
                  ? "orange"
                  : "blue"
              }
            >
              {letter.letter.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <Button onClick={handleDeleteLastLetter} negative style={{ margin: 2 }}>
          DELETE
        </Button>
        <Button onClick={handleSubmit} positive style={{ margin: 2 }}>
          SUBMIT
        </Button>
      </div>
    </div>
  );
}

export default Wordle;
