import styles from "./MainCharacter.module.css";

export type MotionState = "idle" | "starting" | "running" | "stopping";

interface MainCharacterProps {
  motion: MotionState;
  backwards: boolean;
  left: string;
}

export function MainCharacter({ motion, backwards, left }: MainCharacterProps) {
  return (
    <div
      className={`${styles.player} ${styles[motion]} ${backwards ? styles.backwards : ""}`}
      style={{ left }}
      aria-hidden="true"
    >
      <i />
    </div>
  );
}
