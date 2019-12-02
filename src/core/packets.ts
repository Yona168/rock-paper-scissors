import { Packet, Constructor } from "core";

interface ClassAndFields<T extends Packet>{
  clazz: Constructor<T>;
  fieldsToSend: string[];
}

export class PacketRegistry {
  private registry: Map<number, ClassAndFields<Packet>> = new Map();
  private static counter=0;
  public register<T extends Packet>(data: ClassAndFields<T>):number {
    const opcode=PacketRegistry.counter++;
    this.registry.set(opcode, data);
    return opcode;
  }
  public get(opcode: number){
    return this.registry.get(opcode);
  }
}
