import { server, client, Client, Shifter, ShifterOf, Packet } from "core";
import {
  PlayerJoinPacket, PlayerChoosePacket, RenderOtherPlayersPacket,
  ShiftPhasePacket, TiedPacket, PlayerWonPacket, TakenNamePacket
} from "packets";
import { Player, Phase, Choice } from "defenitions";
import uuid from "uuid/v4";
const ser = server();

class Game {
  private readonly server = server(); //Packet hand;er
  private players: Map<string, Player> = new Map(); //All connected players
  //Keeps Track of what phase we are in
  private phaseShifter: Shifter<Phase> = new ShifterOf(Phase.WAITING_JOIN);
  //Map of player Id to current choices
  private choicesMap: Map<string, Choice> = new Map();
  private static getNewId = uuid;
  constructor(rounds: number) {
    //On receive shift packet, shift phase
    this.server.on(ShiftPhasePacket, (pack) => this.phaseShifter.shift(pack.newPhase));
    //When a phase shifts, tell all the players
    this.registerPhaseShifts();
    //On player join, tell all the other players that
    this.server.on(PlayerJoinPacket, (pack, client) => {
      const otherPlayers = Array.from(this.players.values()).slice();
      if (this.phaseShifter.current !== Phase.WAITING_JOIN || otherPlayers.length == 2) {
        return;
      }
      if(otherPlayers.map(it=>it.name).includes(pack.name)){
        client.send(new TakenNamePacket())
      }
      if (otherPlayers.length > 0) {
        client.send(new RenderOtherPlayersPacket(otherPlayers.map(it => it.name)));
      }
      otherPlayers.forEach(send(new PlayerJoinPacket(pack.name)));
      otherPlayers.push({
        name: pack.name,
        client: client,
        wins: 0,
        id: Game.getNewId()
      });
    });
    this.server.on(PlayerChoosePacket, (pack) => {
      if (this.phaseShifter.current !== Phase.WAITING_CHOOSE) {
        return;
      }
      const id = pack.idOrName;
      if (this.choicesMap.get(id)) {
        return;
      }
      if (!this.players.get(id)) {
        return;
      }
      this.choicesMap.set(id, pack.choice);
      const name = this.players.get(id).name;
      this.players.forEach(player => { if (player.id !== id) player.client.send(new PlayerChoosePacket(name, pack.choice)) });

      if (this.choicesMap.size == 2) {
        const players = Array.from(this.players.values());
        const [choiceOne, choiceTwo] = [this.choicesMap.get(players[0].id), this.choicesMap.get(players[1].id)];
        if (choiceOne.tiesWith(choiceTwo)) {
          players.forEach(send(new TiedPacket()))
          this.phaseShifter.shift(Phase.WAITING_CHOOSE);
          return;
        } else {
          const winner = choiceOne.beats().tiesWith(choiceTwo) ? players[0] : players[1];
          players.forEach(send(new PlayerWonPacket(winner.name)));
          this.phaseShifter.shift(Phase.DONE);
        }
      }
    })
  }

  //On every phase shift, send a corresponding packet to the player
  private registerPhaseShifts() {
    const keys = Object.keys(Phase).filter(k => typeof Phase[k as any] === "number");
    const values = keys.map(k => Phase[k as any]).map(it => (it as any) as number);
    values.forEach(phase => this.phaseShifter.onJoin(phase,
      () => this.players.forEach(player => player
        .client.send(new ShiftPhasePacket(phase)))))
  }


}

function send(packet: Packet): (player: Player) => void {
  return player => player.client.send(packet);
}
