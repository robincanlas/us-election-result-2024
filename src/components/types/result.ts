export interface Candidate {
  fullName: string;
  firstName: string;
  lastName: string;
  party: string;
  color: string;
  isWinner: boolean;
  ev: number;
  vote: number;
  votePct: number;
  estPct: number | null;
  id: number;
  isEditorial: boolean;
  isIncumbent: boolean;
  img: string;
}

export interface ElectionResult {
  id: number;
  quickName: string;
  electionDate: string;
  stateName: string;
  officeName: string;
  raceName: string;
  stateCode: string;
  office: string;
  jurisdictionCode: number;
  jType: string;
  electionType: string;
  pollClose: string;
  pollStatus: string;
  pctIn: number;
  totalVote: number;
  electoralVotes: number;
  pledgedDelegates: number | null;
  unpledgedDelegates: number | null;
  winnerTakeAll: boolean;
  incumbentParty: string;
  hasXTab: boolean;
  rating: string | null;
  ratingCandidate: string | null;
  ratingColor: string | null;
  isBattleground: boolean;
  lastUpdated: string;
  callStatus: string | null;
  candidates: Candidate[];
}