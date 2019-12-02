import { server, client, Client } from "core";
import { PlayerJoinPacket } from "./packets";

const ser = server();

interface Player {
  readonly client: Client,
  readonly name: string,
  wins: number,
}

interface Shifter<T> {
  current: T,
  shift(newOne: T): void,
  onExit(thing: T, listener: ((thing: T) => void)): void,
  onJoin(thing: T, listener: ((thing: T) => void)): void
}
enum Phase {
  WAITING_JOIN,
  WAITING_CHOOSE,
  DONE
}
class ShifterOf<T> implements Shifter<T>{
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
class Game {
  private readonly server = server();
  private players: Player[] = [];
  private phaseShifter: Shifter<Phase> = new ShifterOf(Phase.WAITING_JOIN);

  constructor(rounds: number) {
    //Handle player join
    this.server.on(PlayerJoinPacket, (pack, cli) => {
      const otherPlayers = this.players.slice();
      this.players.push({
        client: cli,
        name: pack.name,
        wins: 0
      });
      otherPlayers.forEach(player => player.client.socket.write(pack.writable()));
    });
  }
}
