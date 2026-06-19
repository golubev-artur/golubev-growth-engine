export interface Client {
  slug: string;
  name: string;
  description: string;
  team?: string;
  format?: string;
}

export interface ProtocolParticipant {
  name: string;
  tasks: string[];
}

export interface Protocol {
  id: string;
  date: string;
  participants: ProtocolParticipant[];
  tips?: string[];
}

export interface GoalBlock {
  title: string;
  items: string[];
}

export interface GoalWeek {
  num: number;
  title: string;
  goal: string;
  blocks: GoalBlock[];
  callNote?: string;
}

export interface ResultPair {
  before: string;
  after: string;
}

export interface MonthlyGoal {
  id: string;
  month: string;
  title: string;
  subtitle?: string;
  description?: string;
  principle?: string;
  principleHighlight?: string;
  weeks: GoalWeek[];
  expectedResults?: ResultPair[];
  previousResults?: ResultPair[];
}

export interface ClientData {
  client: Client;
  protocols: Protocol[];
  goals: MonthlyGoal[];
}
