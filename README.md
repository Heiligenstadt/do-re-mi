Do Re Mi to A B C 🎻

This is a practice app to help music learners connect solfege (do–re–mi), letter notation (A–B–C), and the visual/auditory representation of notes.
It’s built for a real student who learned only solfege and is now learning English letter names — so it focuses on reinforcement and quick feedback.
This was my first project I built during my residency at Codesmith. 

✨ Features

1. Two practice modes

- Multiple choice: pick the correct solfege or letter

- Typed mode: type the answer and submit with Enter

2. Alternating questions: odd questions ask for solfege, even questions ask for letter notation

3. Score tracking: 10 questions per session → final score screen

4. Practice log: sends name, score, practice mode, timestamp to the server and shows the last 5 practice sessions

5. Audio + staff image: each note comes from the database with visual and audio references

6. “First try” logic: if you get it wrong once, you can still move on but don’t get the point

🏗️ Tech Stack

Frontend: React + TypeScript + Vite

Backend: Express + TypeScript

Database: PostgreSQL

Other: Fetch API, CORS enabled for http://localhost:5173

🧠 How it works

App fetches all notes from GET /notes on load.

Quiz picks a random note.

odd question → “What is this note in solfege?”

even question → “What is this note in letter notation?”

User answers in the selected mode.

After 10 questions, the app:

shows the score

POSTs to /newlog with the user’s name and score

displays the last 5 logs
