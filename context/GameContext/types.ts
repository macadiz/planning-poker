import { Player } from "../../utils/player/type";
import { SocketClient } from "../../utils/socket/types"

export type GameContextType = {
    client: SocketClient | null;
    session: Session | null;
    setSession: (session: Session) => void;
    player: Player | null,
    players: Player[],
    setPlayer: (player: Player | null) => void;
    addPlayer: (player: Player) => void;
    removePlayer: (playerId: string) => void;
}

export type Session = {
    id: string;
    name: string;
    isOwner?: boolean;
}