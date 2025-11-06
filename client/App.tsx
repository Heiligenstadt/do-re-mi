import { useState, useEffect } from 'react';
import type { JSX } from 'react';
import './App.css';
import Quiz from './controller/quiz.tsx';
import PracticeLog from './components/log.tsx';

export interface Notes {
  id: number;
  letter_notation: string;
  solfege: string;
  treble_image: string;
  audio_file: string;
}

export interface Log {
  name: string;
  score: number;
  mode: string;
  time: string;
}
function App() {
  //six states in this file
  //1. fetched notes data from db
  //2. practice mode (choices or typed, more to come)
  //3. screen mode (home, quiz, score)
  //4. user score
  //5. user name input
  //6. log data fetched from db
  const [allNotes, setAllNotes] = useState<Notes[]>([]);
  const [mode, setMode] = useState<string>();
  const [screen, setScreen] = useState<string>('home');
  const [score, setScore] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [log, setLog] = useState<Log[] | null>(null);

  //GET request
  useEffect(() => {
    if (screen === 'home') {
      const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:3000/notes');
          if (!response.ok) {
            throw new Error('there was a problem fetching data');
          }
          const notesData = await response.json();
          console.log('😃got notes!', notesData);
          setAllNotes(notesData);
        } catch (error) {
          throw new Error('there was a problem fetching data');
        }
      };
      fetchData();
    }
  }, [screen]);

  //POST request
  useEffect(() => {
    if (screen === 'score') {
      const logScore = async () => {
        const url = 'http://localhost:3000/newlog';
        const newLog = {
          name: name,
          score: score,
          mode: mode,
        };
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              accept: 'application/JSON',
              'content-type': 'application/JSON',
            },
            body: JSON.stringify(newLog),
          });
          if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
          }
          const logData = await response.json();
          setLog(logData);
        } catch (error) {
          throw new Error('error during POST request', error);
        }
      };
      logScore();
    }
  }, [screen]);

  console.log('✅log', log);

  //back to home handler
  function homeHandler() {
    setName('');
    setScreen('home');
  }
  //start multiple choice
  function startMultipleChoice() {
    setScore(0);
    setMode('choices');
    setScreen('quiz');
  }
  //start typed
  function startTyped() {
    setScore(0);
    setMode('typed');
    setScreen('quiz');
  }

  //save name
  function saveUserName(e) {
    setName(e.target.value);
  }
  //display options depending on mode
  let display;

  if (screen === 'home') {
    display = (
      <div className='start'>
        <p>Enter your name to log your progress</p>
        <form>
          <input
            type='text'
            value={name}
            placeholder='Your name'
            onChange={saveUserName}
          ></input>
        </form>
        <div className='practiceMode'>
          <button id='mutipleChoice' onClick={() => startMultipleChoice()}>
            Multiple Choice
          </button>
          <button id='mutipleChoice' onClick={() => startTyped()}>
            Type Answer
          </button>
        </div>
        <p>Select your practice mode to start!</p>
      </div>
    );
  } else if (
    (screen === 'quiz' && mode === 'choices') ||
    (screen === 'quiz' && mode === 'typed')
  ) {
    display = (
      <div className='quiz'>
        <Quiz
          notes={allNotes}
          mode={mode}
          score={score}
          screen={screen}
          setScreen={setScreen}
          setScore={setScore}
        />
      </div>
    );
  } else {
    display = (
      <div className='score'>
        <h2>
          {name}'s score: {score}/10
        </h2>
        <button id='replay' onClick={() => homeHandler()}>
          Play again
        </button>
        {log ? (
          <div className='log'>
            <p>Practice Log</p>
            <PracticeLog fetchedLogs={log} />
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }
  //components to render
  return (
    <>
      <div className='title'>
        <h1>Do Re Mi to A B C</h1>
      </div>
      {display}
    </>
  );
}

export default App;
