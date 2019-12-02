import {Packet} from "core";
import {PacketRegistry} from "core/packets";

const packetRegistry=new PacketRegistry();

abstract class PlayerPacket implements Packet{
  readonly name: string;
  constructor(name: string){
    this.name=name;
  }
  writable(){
    return JSON.stringify({name: this.name})
  }
}

export class PlayerJoinPacket extends PlayerPacket{

}

enum Choice{
  ROCK,
  PAPER,
  SCISSORS
}

export class PlayerChoosePacket extends PlayerPacket{
  readonly choice: Choice;
  constructor(name: string, choice: Choice){
    super(name);
    this.choice=choice;
  }
  writable(){
    return JSON.stringify({
      name: this.name,
      choice: this.choice
    })
  }
}

type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
type Data<T> = Pick<T, NonFunctionPropertyNames<T>>;
const data: Data<Packet> ={
  opcode: 5
}
