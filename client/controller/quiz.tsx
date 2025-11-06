import { useState, useEffect } from 'react';
import type { JSX } from 'react';
import type { Notes } from '../App';
import Choices from '../components/choices';
import Note from '../components/notes_av';
import ChoiceResult from '../components/choiceResult.tsx';
import TypeAnswer from '../components/typeAnswer.tsx';

interface Choice {
  id: number;
  label: string;
}
export default function Quiz({
  notes,
  mode,
  screen,
  setScreen,
  score,
  setScore,
}) {
  //five states held in this file
  //1. data of specific note currently being tested on
  //2. current question
  //3. result of the quiz attempt
  //4. random choices generated
  //5. user's typed answer
  const [currentNote, setCurrentNote] = useState<Notes>();
  const [question, setQuestion] = useState<number>(1);
  const [wasWrong, setWasWrong] = useState<boolean>(false);
  const [proceed, setProceed] = useState<string>('wait');
  const [choices, setChoices] = useState<Choice[]>();
  const [typed, setTyped] = useState<string>();

  //**********************************//
  //  CONTROLLER FOR BOTH MODES  //
  //**********************************//

  //get a random note from array
  useEffect(() => {
    if (notes.length > 0) {
      const index = Math.floor(Math.random() * notes.length);
      setCurrentNote(notes[index]);
    }
  }, [notes]);

  console.log('👻currentNote: ', currentNote);

  //reset the note on odd numbered questions
  useEffect(() => {
    if (question % 2 === 1 && notes.length) {
      const index = Math.floor(Math.random() * notes.length);
      setCurrentNote(notes[index]);
    }
  }, [question, notes]);

  //clear input at the start of question
  useEffect(() => {
    if (mode === 'typed') {
      if (question > 1) setTyped('');
      setWasWrong(false);
    }
    if (mode === 'choices') {
      if (question > 1) setWasWrong(false);
    }
  }, [question]);

  //*************************//
  //   MUTIPLE CHOICE MODE   //
  //*************************//

  //logic for when correct choice is clicked
  function choiceHandler(id: number) {
    if (id === currentNote!.id && wasWrong === false) {
      setQuestion(question + 1);
      setScore(score + 1);
      setProceed('yes');
    } else if (id === currentNote!.id && wasWrong === true) {
      setQuestion(question + 1);
      setProceed('yes');
    } else {
      setWasWrong(true);
      setProceed('no');
    }
    if (question === 10) {
      setScreen('score');
    }
  }

  //helper function to shuffle choices
  function shuffle(array: Choice[]): Choice[] {
    for (let i = array.length - 1; i > 0; i--) {
      const index = Math.floor(Math.random() * (i + 1));
      [array[i], array[index]] = [array[index], array[i]];
    }
    return array;
  }

  //logic for generating choices
  useEffect(() => {
    if (mode === 'choices') {
      if (question % 2 === 1 && currentNote) {
        //solfege choices
        const choices: Choice[] = [];
        const allSolfege = notes.map((note) => ({
          id: note.id,
          label: note.solfege,
        }));
        const correctChoice = allSolfege.find(
          (note) => note.label === currentNote.solfege
        );
        choices.push(correctChoice);
        const indexToRemove = allSolfege.indexOf(correctChoice);
        allSolfege.splice(indexToRemove, 1);
        for (let i = 0; i < 2; i++) {
          if (!allSolfege.length) return;
          const randomIndex = Math.floor(Math.random() * allSolfege.length);
          const randomChoice = allSolfege[randomIndex];
          choices.push(randomChoice);
          allSolfege.splice(randomIndex, 1);
        }
        const shuffledChoices = shuffle(choices);
        setChoices(shuffledChoices);
      } else if (question % 2 === 0 && currentNote) {
        //letter choices
        const choices: Choice[] = [];
        const allLetters = notes.map((note) => ({
          id: note.id,
          label: note.letter_notation,
        }));
        const correctChoice = allLetters.find(
          (note) => note.label === currentNote.letter_notation
        );
        choices.push(correctChoice);
        const indexToRemove = allLetters.indexOf(correctChoice);
        allLetters.splice(indexToRemove, 1);
        for (let i = 0; i < 2; i++) {
          if (!allLetters.length) return;
          const randomIndex = Math.floor(Math.random() * allLetters.length);
          const randomChoice = allLetters[randomIndex];
          choices.push(randomChoice);
          allLetters.splice(randomIndex, 1);
        }
        const shuffledChoices = shuffle(choices);
        setChoices(shuffledChoices);
      }
    }
  }, [question, currentNote, mode]);

  //*****************//
  //  TYPING MODE    //
  //*****************//

  //submit handler with logic for correct/incorrect
  function submitTyped(e) {
    e.preventDefault();
    const correctSolfege = currentNote?.solfege.toLowerCase();
    const correctLetter = currentNote?.letter_notation.toLowerCase();
    if (
      (question % 2 === 1 &&
        correctSolfege === typed?.toLowerCase() &&
        wasWrong === false) ||
      (question % 2 === 0 &&
        correctLetter === typed?.toLowerCase() &&
        wasWrong === false)
    ) {
      setQuestion(question + 1);
      setScore(score + 1);
      setTyped('');
      setProceed('yes');
    } else if (
      (correctSolfege === typed?.toLowerCase() && wasWrong === true) ||
      (correctLetter === typed?.toLowerCase() && wasWrong === true)
    ) {
      setTyped('');
      setProceed('yes');
      setQuestion(question + 1);
    } else {
      setTyped('');
      setProceed('no');
      setWasWrong(true);
    }
    if (question === 10) {
      setScreen('score');
    }
  }

  //onchange handler
  function saveTypedAnswer(e) {
    setProceed('wait');
    setTyped(e.target.value);
  }

  //keydown handler
  function enterToSubmit(e) {
    if (e.key === 'Enter') submitTyped(e);
  }

  //display logic
  let display;
  if (mode === 'choices') {
    display = (
      <div className='choices'>
        {choices ? (
          <Choices clickEvent={choiceHandler} multipleChoices={choices} />
        ) : (
          <p>Loading…</p>
        )}
      </div>
    );
  } else if (mode === 'typed') {
    display = (
      <div className='typed'>
        {
          <TypeAnswer
            value={typed}
            saveInput={saveTypedAnswer}
            onEnter={enterToSubmit}
          />
        }
      </div>
    );
  }
  if (!currentNote) {
    return <p>Loading…</p>;
  }
  //components to render

  return (
    <>
      <div className='note'>
        <Note
          visual={currentNote.treble_image}
          alt={currentNote.letter_notation}
          audio={currentNote.audio_file}
        />
      </div>
      <div className='question'>
        {question % 2 === 1 ? (
          <h2>Q{question}: What is this note in solfege?</h2>
        ) : (
          <h2>Q{question}: What is this note in letter notation?</h2>
        )}
      </div>
      {display}
      <div className='result'>
        <ChoiceResult correct={proceed} />
      </div>
    </>
  );
}
