import type { JSX } from 'react';

export default function Note(props) {
  //handler for onclick audio
  function playAudio() {
    const audio = new Audio(props.audio);
    audio.play();
  }
  return (
    <>
      <p>Click on the image to hear the note👂</p>
      <img
        src={props.visual}
        alt={props.alt}
        width='200px'
        height='200px'
        onClick={() => playAudio()}
      />
    </>
  );
}
