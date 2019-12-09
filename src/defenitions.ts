import { Client } from "core";
export interface Player {
  readonly client: Client,
  readonly name: string,
  wins: number,
  id: string;
}

export enum Phase {
  WAITING_JOIN,
  WAITING_CHOOSE,
  DONE
}
export class Choice {
  static readonly ROCK = new Choice("Rock");
  static readonly PAPER = new Choice("Paper");
  static readonly SCISSORS = new Choice("Scissors");
  private readonly name: string;
  constructor(name: string){
    this.name=name;
  }
  beats() {
    switch(this.name){
      case "Rock": return Choice.SCISSORS;
      case "Paper": return Choice.ROCK;
      case "Scissors": return Choice.PAPER;
    }
  }
  tiesWith(other: Choice){
    return this.name===other.name;
  }
}
