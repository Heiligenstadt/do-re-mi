import type { JSX } from 'react';

export default function TypeAnswer({ saveInput, onEnter, value }) {
  return (
    <form>
      <input
        id='typeMode'
        type='text'
        value={value}
        onChange={saveInput}
        onKeyDown={onEnter}
      ></input>
    </form>
  );
}
