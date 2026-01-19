import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { BoardGame } from '@/app/types/game';
import { GameCard } from '@/app/components/GameCard';
import { PasswordModal } from '@/app/components/PasswordModal';

interface GameListProps {
  games: BoardGame[];
  adminPassword: string;
}

export function GameList({ games, adminPassword }: GameListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // 비밀 코드 체크
    if (value === '주사위는던져졌다') {
      setShowPasswordModal(true);
      setSearchQuery('');
    }
  };

  const handlePasswordSuccess = () => {
    setShowPasswordModal(false);
    navigate('/admin');
  };

  // 인원수 범위 검색 함수
  const matchesPlayerCount = (game: BoardGame, query: string): boolean => {
    const playerCount = parseInt(query);
    
    // 숫자가 아니면 일반 텍스트 검색
    if (isNaN(playerCount)) {
      return game.recommendedPlayers.toLowerCase().includes(query.toLowerCase());
    }
    
    // 숫자면 범위 검색
    // "3-6명", "4-8명" 같은 형식에서 숫자 추출
    const numbers = game.recommendedPlayers.match(/\d+/g);
    if (!numbers) return false;
    
    if (numbers.length === 1) {
      // "4명" 같은 단일 숫자
      return parseInt(numbers[0]) === playerCount;
    } else if (numbers.length >= 2) {
      // "3-6명" 같은 범위
      const min = parseInt(numbers[0]);
      const max = parseInt(numbers[1]);
      return playerCount >= min && playerCount <= max;
    }
    
    return false;
  };

  const filteredGames = games.filter(game => {
    const query = searchQuery.toLowerCase();
    
    return (
      game.name.toLowerCase().includes(query) ||
      game.description.toLowerCase().includes(query) ||
      matchesPlayerCount(game, searchQuery)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordSuccess}
        password={adminPassword}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              보드게임 목록
            </h1>
            <span className="text-4xl animate-bounce">🎮</span>
          </div>
          <p className="text-gray-700 mb-6 text-lg">총 {games.length}개의 재미있는 게임 🎲</p>
          
          {/* 검색 바 */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
            <input
              type="text"
              placeholder="🔍 게임 이름, 설명, 인원수로 검색..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-12 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold text-xl"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {filteredGames.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border-4 border-dashed border-purple-200">
            <span className="text-6xl mb-4 block">🎲</span>
            <p className="text-gray-500 text-lg">
              {searchQuery ? '검색 결과가 없습니다.' : '등록된 게임이 없습니다.'}
            </p>
          </div>
        ) : (
          <>
            {searchQuery && (
              <div className="bg-purple-100 border-l-4 border-purple-500 px-4 py-3 rounded-lg mb-6">
                <p className="text-purple-800 font-semibold">
                  🎯 {filteredGames.length}개의 검색 결과
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}