import {Packet} from "core";
import {Phase, Choice} from "defenitions";
export abstract class PlayerPacket implements Packet{
  readonly name: string;
  constructor(name: string){
    this.name=name;
  }
}

export class PlayerJoinPacket extends PlayerPacket{

}

export class TakenNamePacket implements Packet{

}

export class PlayerLeavePacket extends PlayerPacket{

}

export class PlayerWonPacket extends PlayerPacket{

}

export class TiedPacket implements Packet{

}
export class RenderOtherPlayersPacket implements Packet{
  readonly otherPlayerNames: string[]
  constructor(otherPlayerNames: string[]){
    this.otherPlayerNames=otherPlayerNames;
  }
}


export class PlayerChoosePacket extends PlayerPacket{
  readonly choice: Choice;
  readonly idOrName: string;
  constructor(name: string, choice: Choice){
    super(name);
    this.idOrName=name;
    this.choice=choice;
  }
}

export class ShiftPhasePacket implements Packet{
  readonly newPhase: Phase;
  constructor(newPhase: Phase){
    this.newPhase=newPhase;
  }
}


/*Maybe use this later
type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
type Data<T> = Pick<T, NonFunctionPropertyNames<T>>;
*/
