export type ConversationSide = "left" | "right";
export type ConversationPosition = "left" | "right" | "centerLeft" | "centerRight";
export type ConversationActorSize = "medium" | "large";

export interface ConversationActor {
  id: string;
  name: string;
  side: ConversationSide;
  size?: ConversationActorSize;
  sprites: Record<string, string> & { neutral: string };
}

export interface ConversationChoice {
  id: string;
  text: string;
  next: string;
  setFlag?: string;
}

export interface ConversationNode {
  speaker: string;
  text: string;
  emotion?: string;
  position?: ConversationPosition;
  motion?: string;
  next?: string;
  choices?: ConversationChoice[];
}

export interface ConversationDefinition {
  id: string;
  startNode: string;
  actors: Record<string, ConversationActor>;
  nodes: Record<string, ConversationNode>;
}
