import { Link } from 'react-router-dom';
import { Users, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { BoardGame } from '@/app/types/game';

interface GameCardProps {
  game: BoardGame;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-0 border-4 border-purple-200 hover:border-purple-400 hover:-translate-y-1 relative overflow-hidden group">
      {/* 게임 이미지 */}
      {game.imageUrl ? (
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
          <img 
            src={game.imageUrl} 
            alt={game.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
          <ImageIcon className="w-16 h-16 text-purple-400" />
        </div>
      )}
      
      {/* 게임 정보 */}
      <div className="p-6">
        <Link to={`/game/${game.id}`}>
          <h3 className="font-bold text-xl text-gray-900 mb-3 hover:text-purple-600 transition-colors relative z-10">
            {game.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 text-purple-700 mb-3 bg-purple-50 px-3 py-2 rounded-lg relative z-10">
          <Users className="w-5 h-5" />
          <span className="font-semibold text-sm">{game.recommendedPlayers}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 relative z-10">
          {game.description}
        </p>
        
        {game.rulesUrl && (
          <a
            href={game.rulesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-pink-600 hover:text-pink-700 text-sm font-medium hover:underline relative z-10"
          >
            <ExternalLink className="w-4 h-4" />
            규칙 보기 📖
          </a>
        )}
      </div>
    </div>
  );
}