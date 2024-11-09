import { useEffect, useState } from "react";
import { Candidate, ElectionResult } from "../types/result";

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
    <>
      <table>
        <tr>
          <th>Name</th>
          <th>Vote %</th>
          <th>Vote count</th>
        </tr>
        {candidates.sort((a, b) => b.vote - a.vote).map((candidate) => (
          <tr>
            <td>{candidate.fullName}</td>
            <td>{candidate.votePct}</td>
            <td>{candidate.vote}</td>
          </tr>
        ))}
      </table>
    </>
  )
};

export default ResultPopupTable;