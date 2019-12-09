import net from "net";

export interface Packet {

}

export interface Constructor<T> {
  new(...args: any[]): T
}

interface PacketProcessor {
  on<T extends Packet>(clazz: Constructor<T>, action: (packet: T, client: Client) => void): void
}
export interface Client extends PacketProcessor {
  connect(port: number, ip: string): Promise<void>;
  send<T extends Packet>(packet: T): void;
}

export interface Server extends PacketProcessor {
  open(): Promise<void>;
  onClient(action: (client: Client)=>void): void;
}


export function client(port: number, ip: string): Client {
  return {
    connect(port: number, ip: string) {
      throw new Error("Unsupported!")
    },
    on<T extends Packet>(clazz: Constructor<T>, action: (packet: T, client: Client) => void) {
      throw new Error("Unsupported!")
    },
    send<T extends Packet>(packet: T){
      throw new Error("Unsupported!")
    }
  }
}

export function server(): Server {
  return {
    open() { throw new Error("Unsupported!") },
    on<T extends Packet>(clazz: Constructor<T>, action: (packet: T, client: Client) => void) {
      throw new Error("Unsupported!")
    },
    onClient(action: (client: Client)=>void) {
      throw new Error("Unsupported!")
    }
  }
}

export interface Shifter<T> {
  current: T,
  shift(newOne: T): void,
  onExit(thing: T, listener: ((thing: T) => void)): void,
  onJoin(thing: T, listener: ((thing: T) => void)): void
}
export class ShifterOf<T> implements Shifter<T>{
  current: T;
  private readonly onExits = new Map<T, ((thing: T) => void)[]>();
  private readonly onJoins = new Map<T, ((thing: T) => void)[]>();
  constructor(current: T) {
    this.current = current;
  }
  shift(newOne: T) {
    this.onExits.get(this.current).forEach(listener => listener(this.current));
    this.current = newOne;
    this.onJoins.get(this.current).forEach(listener => listener(this.current));
  }
  onExit(thing: T, listener: ((thing: T) => void)) {
    const listeners = this.onExits.get(thing) || [];
    listeners.push(listener);
    this.onExits.set(thing, listeners);
  }
  onJoin(thing: T, listener: ((thing: T) => void)) {
    const listeners = this.onJoins.get(thing) || [];
    listeners.push(listener);
    this.onJoins.set(thing, listeners);
  }
}
