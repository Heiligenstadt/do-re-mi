import type { JSX } from 'react';

export interface Log {
  name: string;
  score: number;
  mode: string;
  time: string;
}
export default function PracticeLog({ fetchedLogs }) {
  return (
    <table>
      <tr>
        <th>NAME</th>
        <th>SCORE</th>
        <th>MODE</th>
        <th>PRACTICED ON</th>
      </tr>
      {fetchedLogs.map((log: Log) => {
        return (
          <tr>
            <td>{log.name}</td>
            <td>{log.score}</td>
            <td>
              {log.mode === 'typed' ? (
                <span>Typed</span>
              ) : (
                <span>Mutiple Choice</span>
              )}
            </td>
            <td>{log.time}</td>
          </tr>
        );
      })}
    </table>
  );
}
