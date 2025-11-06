import type { JSX } from 'react';

export default function ChoiceResult({ correct }) {
  const correctMessages = [
    'Correct✅',
    'Great job👏',
    'Hooray🎉',
    'Nice!',
    "You're nailing it😎",
    'Exactly😃',
    'Well done👍',
  ];
  const incorrectMessages = [
    'Try again😖',
    'Not quite🫤',
    'Almost!',
    'Hmmm...are you sure?',
    'Oops, wrong answer🫣',
  ];
  let message;
  if (correct === 'yes') {
    message =
      correctMessages[Math.floor(Math.random() * correctMessages.length)];
  } else if (correct === 'no') {
    message =
      incorrectMessages[Math.floor(Math.random() * incorrectMessages.length)];
  } else {
    message = '';
  }
  return <p style={{ color: '#fe4f2d' }}>{message}</p>;
}
