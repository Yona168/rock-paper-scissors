import net from "net";

export interface Packet {
  writable(): Uint8Array|string,
  readonly opcode: number;
}

export interface Constructor<T> {
  new(...args: any[]): T
}

interface PacketProcessor {
  on<T extends Packet>(clazz: Constructor<T>, action: (packet: T, client: Client) => void): void
}
export interface Client extends PacketProcessor {
  connect(port: number, ip: string): Promise<void>;
  readonly socket?: net.Socket
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
