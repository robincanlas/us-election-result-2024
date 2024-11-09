import Plot from 'react-plotly.js';
import { ElectionResult } from '../types/result';
import { useEffect, useState } from 'react';

interface ResultChartProps {
  result: ElectionResult;
}

const ResultChart = ({
  result
}: ResultChartProps) => {
  const [voteCount, setVoteCount] = useState<number[]>([]);
  // const [votePercent, setVotePercent] = useState<number[]>([]);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);


  useEffect(() => {
    if (!result) return;
    const { candidates } = result;
    const sortedCandidates = candidates.filter(candidate => candidate.lastName === 'Trump' || candidate.lastName === 'Harris').sort((a, b) => a.vote - b.vote);
    setCandidates(sortedCandidates.map(candidate => candidate.fullName));
    setVoteCount(sortedCandidates.map(candidate => candidate.vote));
    // setVotePercent(sortedCandidates.map(candidate => candidate.votePct));
    setColors(sortedCandidates.map(candidate => candidate.color));
    
  }, [result]);

  return (
    <>
      <Plot
        style={{ border: '1px solid black' }}
        data={[{
          type: 'bar',
          x: [...voteCount],
          y: [...candidates],
          orientation: 'h',
          marker: {
            color: [...colors],
          }
        }]}
        layout={ {width: 400, height: 250} }
        config={ { responsive: true, displayModeBar: false } }
      />
    </>
  );
}

export default ResultChart