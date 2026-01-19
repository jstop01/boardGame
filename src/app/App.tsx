import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '@/app/components/Header';
import { GameList } from '@/app/pages/GameList';
import { GameDetail } from '@/app/pages/GameDetail';
import { AdminGameList } from '@/app/pages/AdminGameList';
import { AdminGameForm } from '@/app/pages/AdminGameForm';
import { BoardGame } from '@/app/types/game';
import { supabase } from '@/lib/supabase';

export default function App() {
  const [games, setGames] = useState<BoardGame[]>([]);
  const [adminPassword, setAdminPassword] = useState('1234');
  const [loading, setLoading] = useState(true);

  // 게임 목록 불러오기
  useEffect(() => {
    fetchGames();
    fetchAdminPassword();
  }, []);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('board_games')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedGames: BoardGame[] = (data || []).map(game => ({
        id: game.id,
        name: game.name,
        recommendedPlayers: game.recommended_players,
        description: game.description,
        rulesUrl: game.rules_url,
        imageUrl: game.image_url,
        createdAt: new Date(game.created_at)
      }));

      setGames(formattedGames);
    } catch (error) {
      console.error('게임 목록 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminPassword = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('password')
        .single();

      if (error) throw error;
      if (data) setAdminPassword(data.password);
    } catch (error) {
      console.error('비밀번호 불러오기 실패:', error);
    }
  };

  const handleSaveGame = async (game: BoardGame) => {
    try {
      const gameData = {
        id: game.id,
        name: game.name,
        recommended_players: game.recommendedPlayers,
        description: game.description,
        rules_url: game.rulesUrl,
        image_url: game.imageUrl,
        updated_at: new Date().toISOString()
      };

      // 기존 게임인지 확인
      const { data: existingGame } = await supabase
        .from('board_games')
        .select('id')
        .eq('id', game.id)
        .single();

      if (existingGame) {
        // 수정
        const { error } = await supabase
          .from('board_games')
          .update(gameData)
          .eq('id', game.id);

        if (error) throw error;
      } else {
        // 새로 추가
        const { error } = await supabase
          .from('board_games')
          .insert([{ ...gameData, created_at: new Date().toISOString() }]);

        if (error) throw error;
      }

      // 게임 목록 새로고침
      await fetchGames();
    } catch (error) {
      console.error('게임 저장 실패:', error);
      alert('❌ 게임 저장에 실패했습니다.');
    }
  };

  const handlePasswordChange = async (newPassword: string) => {
    try {
      const { data: settings } = await supabase
        .from('admin_settings')
        .select('id')
        .single();

      if (settings) {
        const { error } = await supabase
          .from('admin_settings')
          .update({ password: newPassword, updated_at: new Date().toISOString() })
          .eq('id', settings.id);

        if (error) throw error;

        setAdminPassword(newPassword);
        alert('✅ 비밀번호가 성공적으로 변경되었습니다!');
      }
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      alert('❌ 비밀번호 변경에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

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