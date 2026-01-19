export interface BoardGame {
  id: string;
  name: string;
  recommendedPlayers: string;
  description: string;
  rulesUrl: string;
  imageUrl?: string;
  createdAt: Date;
}