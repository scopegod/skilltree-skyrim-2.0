// src/NodeEditor/types.ts

export type NodeStatus = "locked" | "unlockable" | "completed";

export interface SkillNode {
  id: number;
  title: string;
  description?: string;
  x: number;
  y: number;

  parentId: number | null; // ← allow null
  childrenIds: number[];

  status: NodeStatus;
  isRoot?: boolean;

  code: string; // ← REQUIRED, you already use it
}
