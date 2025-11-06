import type { JSX } from 'react';

interface Choices {
  id: string;
  label: string;
}
export default function Choices({ ...props }) {
  return (
    <div>
      {props.multipleChoices.map((choice) => {
        return (
          <button key={choice.id} onClick={() => props.clickEvent(choice.id)}>
            {choice.label}
          </button>
        );
      })}
    </div>
  );
}
