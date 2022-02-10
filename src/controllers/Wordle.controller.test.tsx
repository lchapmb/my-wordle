import { WordleController } from "./Wordle.controller";

test("testing if 'test' is a real word, should return true", async () => {
  const val = await WordleController.checkIfStringIsWord("test");
  expect(val).toBe(true);
});

test("testing if 'gfgfd' is a real word, should return false", async () => {
  const val = await WordleController.checkIfStringIsWord("gfgfd");
  expect(val).toBe(false);
});

test("testing if 'thermo' is a real word, should return true", async () => {
  const val = await WordleController.checkIfStringIsWord("thermo");
  expect(val).toBe(true);
});

test("testing if '0123fdf' is a real word, should return false", async () => {
  const val = await WordleController.checkIfStringIsWord("0123fdf");
  expect(val).toBe(false);
});

test("testing if 'basic' is a real word, should return true", async () => {
  const val = await WordleController.checkIfStringIsWord("basic");
  expect(val).toBe(true);
});

test("testing if 'BASIC' a real word but in caps, should return true", async () => {
  const val = await WordleController.checkIfStringIsWord("BASIC");
  expect(val).toBe(true);
});

test("testing if 'nulrp' is a real word, should return false", async () => {
  const val = await WordleController.checkIfStringIsWord("nulrp");
  expect(val).toBe(false);
});

test("testing if 'basfr' is a real word, should return false", async () => {
  const val = await WordleController.checkIfStringIsWord("basfr");
  expect(val).toBe(false);
});

test("testing if 'pollow' is a real word, should return false", async () => {
  const val = await WordleController.checkIfStringIsWord("pollow");
  expect(val).toBe(false);
});

test("testing what blank values do, should return false", async () => {
  const val = await WordleController.checkIfStringIsWord("");
  expect(val).toBe(false);
});

test("testing what having a space in the string does with two real words, should return true if the first word is real", async () => {
  const val = await WordleController.checkIfStringIsWord("thermo banana");
  expect(val).toBe(true);
});

test("testing what having a space in the string does with no real words, should return false", async () => {
  const val = await WordleController.checkIfStringIsWord(
    "fgfdgfd banana thermo"
  );
  expect(val).toBe(false);
});

test("testing to see if the 'generateWordleWord' method returns a word", async () => {
  const word = await WordleController.generateWordleWord();
  expect(word).toBeTruthy();
});

test("testing to see if the 'generateWordleWord' method returns a word that is 5 characters in length", async () => {
  const word = await WordleController.generateWordleWord();
  expect(word.length).toBe(5);
});
