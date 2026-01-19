import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { BoardGame } from '@/app/types/game';

interface GameDetailProps {
  games: BoardGame[];
}

export function GameDetail({ games }: GameDetailProps) {
  const { id } = useParams();
  const game = games.find(g => g.id === id);

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <span className="text-6xl mb-4 block">😕</span>
            <p className="text-gray-500 text-lg mb-4">게임을 찾을 수 없습니다.</p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 font-semibold hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          목록으로 돌아가기
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-purple-200 relative">
          {/* 대표 이미지 */}
          {game.imageUrl ? (
            <div className="relative h-64 sm:h-80 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
              <img 
                src={game.imageUrl} 
                alt={game.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                    {game.name}
                  </h1>
                  <span className="text-3xl">🏆</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 sm:h-80 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center relative">
              <ImageIcon className="w-24 h-24 text-purple-400 opacity-50" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold text-purple-900 drop-shadow-lg">
                    {game.name}
                  </h1>
                  <span className="text-3xl">🏆</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="p-6 sm:p-10 relative z-10">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200">
                <div className="flex items-center gap-3 text-purple-700 mb-2">
                  <Users className="w-6 h-6" />
                  <span className="font-bold text-lg">추천 인원수</span>
                </div>
                <p className="text-gray-700 ml-9 text-lg font-semibold">{game.recommendedPlayers}</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200">
                <h2 className="font-bold text-blue-700 mb-3 text-lg flex items-center gap-2">
                  <span>📝</span> 게임 설명
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{game.description}</p>
              </div>

              {game.rulesUrl && (
                <div className="bg-green-50 rounded-xl p-5 border-2 border-green-200">
                  <h2 className="font-bold text-green-700 mb-3 text-lg flex items-center gap-2">
                    <span>📖</span> 게임 규칙
                  </h2>
                  <a
                    href={game.rulesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold hover:underline text-lg"
                  >
                    <ExternalLink className="w-5 h-5" />
                    {game.rulesUrl}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}