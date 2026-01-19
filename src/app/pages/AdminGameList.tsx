import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, ArrowLeft, Key } from 'lucide-react';
import { BoardGame } from '@/app/types/game';
import { ChangePasswordModal } from '@/app/components/ChangePasswordModal';

interface AdminGameListProps {
  games: BoardGame[];
  adminPassword: string;
  onPasswordChange: (newPassword: string) => void;
}

export function AdminGameList({ games, adminPassword, onPasswordChange }: AdminGameListProps) {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSave={onPasswordChange}
        currentPassword={adminPassword}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 font-semibold hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          사용자 페이지로 돌아가기
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                관리자 페이지
              </h1>
              <span className="text-3xl">⚙️</span>
            </div>
            <p className="text-gray-700 text-lg">총 {games.length}개의 게임 관리중 🎲</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setShowChangePasswordModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <Key className="w-5 h-5" />
              비밀번호 변경 🔐
            </button>
            <Link
              to="/admin/new"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <Plus className="w-5 h-5" />
              게임 추가 ✨
            </Link>
          </div>
        </div>

        {games.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border-4 border-dashed border-purple-200">
            <span className="text-6xl mb-4 block">🎮</span>
            <p className="text-gray-500 mb-4 text-lg">등록된 게임이 없습니다.</p>
            <Link
              to="/admin/new"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
            >
              <Plus className="w-5 h-5" />
              첫 번째 게임 추가하기
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-purple-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-purple-200">
                <thead className="bg-gradient-to-r from-purple-100 to-pink-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                      🎮 게임 이름
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider hidden sm:table-cell">
                      👥 추천 인원수
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider hidden md:table-cell">
                      📝 설명
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-purple-700 uppercase tracking-wider">
                      ⚡ 작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-purple-100">
                  {games.map(game => (
                    <tr key={game.id} className="hover:bg-purple-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">{game.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">
                        {game.recommendedPlayers}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                        <div className="line-clamp-2">{game.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <Link
                          to={`/admin/edit/${game.id}`}
                          className="inline-flex items-center gap-1 text-pink-600 hover:text-pink-700 font-semibold hover:underline"
                        >
                          <Edit className="w-4 h-4" />
                          수정
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}