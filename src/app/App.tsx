import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '@/app/components/Header';
import { GameList } from '@/app/pages/GameList';
import { GameDetail } from '@/app/pages/GameDetail';
import { AdminGameList } from '@/app/pages/AdminGameList';
import { AdminGameForm } from '@/app/pages/AdminGameForm';
import { BoardGame } from '@/app/types/game';

const initialGames: BoardGame[] = [
  {
    id: '1',
    name: '카탄',
    recommendedPlayers: '3-4명',
    description: '자원을 모아 섬을 개척하는 전략 게임입니다. 주사위를 굴려 자원을 얻고, 도로와 마을을 건설하여 점수를 획득합니다.',
    rulesUrl: 'https://www.catan.com/game/catan',
    imageUrl: 'https://images.unsplash.com/photo-1606733847546-db8546099013?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2FyZCUyMGdhbWUlMjBjYXRhbnxlbnwxfHx8fDE3Njg4MTE1ODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: '스플렌더',
    recommendedPlayers: '2-4명',
    description: '보석 상인이 되어 부를 쌓는 게임입니다. 보석 토큰을 모아 카드를 구매하고, 귀족의 방문을 받아 승리 포인트를 획득합니다.',
    rulesUrl: 'https://www.spacecowboys.fr/splendor',
    imageUrl: 'https://images.unsplash.com/photo-1764733907486-0fa77a834dd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2FyZCUyMGdhbWUlMjBjYXJkcyUyMGdlbXN8ZW58MXx8fHwxNzY4ODExNTgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    createdAt: new Date('2024-01-02')
  },
  {
    id: '3',
    name: '코드네임',
    recommendedPlayers: '4-8명',
    description: '단어 추리 파티 게임입니다. 스파이마스터의 힌트를 듣고 팀원들이 올바른 단어를 찾아야 합니다.',
    rulesUrl: 'https://codenamesgame.com/',
    imageUrl: 'https://images.unsplash.com/photo-1767510533187-6cb5a8743cf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2FyZCUyMGdhbWUlMjBwYXJ0eSUyMGNhcmRzfGVufDF8fHx8MTc2ODgxMTU4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    createdAt: new Date('2024-01-03')
  }
];

export default function App() {
  const [games, setGames] = useState<BoardGame[]>(initialGames);
  const [adminPassword, setAdminPassword] = useState('1234');

  const handleSaveGame = (game: BoardGame) => {
    setGames(prev => {
      const existingIndex = prev.findIndex(g => g.id === game.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = game;
        return updated;
      }
      return [...prev, game];
    });
  };

  const handlePasswordChange = (newPassword: string) => {
    setAdminPassword(newPassword);
    alert('✅ 비밀번호가 성공적으로 변경되었습니다!');
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Header />
        <Routes>
          <Route path="/" element={<GameList games={games} adminPassword={adminPassword} />} />
          <Route path="/game/:id" element={<GameDetail games={games} />} />
          <Route path="/admin" element={<AdminGameList games={games} adminPassword={adminPassword} onPasswordChange={handlePasswordChange} />} />
          <Route path="/admin/new" element={<AdminGameForm games={games} onSave={handleSaveGame} />} />
          <Route path="/admin/edit/:id" element={<AdminGameForm games={games} onSave={handleSaveGame} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}