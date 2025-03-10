import type { DiceQueen } from '../service/command/dice.js';
import type { RandomGenerator as JudgingRng } from '../service/command/judging.js';
import type { RandomGenerator as PartyRng } from '../service/command/party.js';

export class MathRandomGenerator implements PartyRng, JudgingRng, DiceQueen {
  minutes(): number {
    return Math.floor(Math.random() * 60);
  }

  pick<T>(array: readonly T[]): T {
    return [...array].sort(() => Math.random() * 2 - 1)[0];
  }

  sleep(): Promise<void> {
    const milliSeconds = this.uniform(200, 4000);
    return new Promise((resolve) => setTimeout(resolve, milliSeconds));
  }

  uniform(from: number, to: number): number {
    from = Math.ceil(from);
    to = Math.floor(to);
    return Math.floor(Math.random() * (to - from) + from);
  }

  roll(faces: number, howManyRolls: number): Array<number> {
    const diceLog: number[] = [];
    for (let i = 0; i < howManyRolls; ++i) {
      diceLog.push(this.uniform(1, faces));
    }
    return diceLog;
  }
}
