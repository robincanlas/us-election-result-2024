import { useEffect, useState } from "react";
import { Candidate, ElectionResult } from "../types/result";
import "./result-popup-table.css";
import numberWithCommas from "../../utilities/thousandSeparator";

interface ResultChartProps {
  result: ElectionResult;
}

const ResultPopupTable = ({
  result
}: ResultChartProps) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    if (!result) return;
    const { candidates } = result;
    const sortedCandidates = candidates.filter(candidate => candidate.lastName === 'Trump' || candidate.lastName === 'Harris');
    setCandidates(sortedCandidates);
  }, [result]);

  return (
    <span className="result-popup-table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Vote %</th>
            <th>Vote count</th>
          </tr>
        </thead>
        <tbody>
        {candidates.sort((a, b) => b.vote - a.vote).map((candidate, i) => (
          <tr key={candidate.fullName}>
            <td style={{ 
              backgroundColor: i === 0 ? candidate.color : 'white',
              color: i === 0 ? 'white' : 'black',
              fontWeight: i === 0 ? '500' : 'normal' 
            }}>{i === 0 ? <>&#10003;</> : <span className="dot" style={{ backgroundColor: candidate.color}} />} {candidate.fullName}</td>
            <td style={{ fontWeight: i === 0 ? '500' : 'normal' }}>{candidate.votePct}%</td>
            <td style={{ fontWeight: i === 0 ? '500' : 'normal' }}>{numberWithCommas(candidate.vote)}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </span>
  )
};

export default ResultPopupTable;