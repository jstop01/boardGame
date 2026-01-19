import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { BoardGame } from '@/app/types/game';

interface AdminGameFormProps {
  games: BoardGame[];
  onSave: (game: BoardGame) => void;
}

export function AdminGameForm({ games, onSave }: AdminGameFormProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const existingGame = games.find(g => g.id === id);

  const [formData, setFormData] = useState({
    name: '',
    recommendedPlayers: '',
    description: '',
    rulesUrl: '',
    imageUrl: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');

  useEffect(() => {
    if (isEdit && existingGame) {
      setFormData({
        name: existingGame.name,
        recommendedPlayers: existingGame.recommendedPlayers,
        description: existingGame.description,
        rulesUrl: existingGame.rulesUrl,
        imageUrl: existingGame.imageUrl || ''
      });
      if (existingGame.imageUrl) {
        setImagePreview(existingGame.imageUrl);
      }
    }
  }, [isEdit, existingGame]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const game: BoardGame = {
      id: isEdit ? id! : `game-${Date.now()}`,
      ...formData,
      imageUrl: imagePreview || formData.imageUrl,
      createdAt: isEdit && existingGame ? existingGame.createdAt : new Date()
    };

    onSave(game);
    navigate('/admin');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert('이미지 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 이미지 파일인지 확인
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setFormData(prev => ({
        ...prev,
        imageUrl: ''
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      imageUrl: value
    }));
    setImagePreview(value);
  };

  const clearImage = () => {
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }));
  };

  if (isEdit && !existingGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <span className="text-6xl mb-4 block">😕</span>
            <p className="text-gray-500 mb-4">게임을 찾을 수 없습니다.</p>
            <Link 
              to="/admin" 
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              관리자 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          to="/admin" 
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 font-semibold hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          관리자 페이지로 돌아가기
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border-4 border-purple-200">
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {isEdit ? '게임 정보 수정' : '새 게임 등록'}
            </h1>
            <span className="text-3xl">{isEdit ? '✏️' : '✨'}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-purple-700 mb-2">
                🎮 게임 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="게임 이름을 입력하세요"
              />
            </div>

            <div>
              <label htmlFor="recommendedPlayers" className="block text-sm font-bold text-purple-700 mb-2">
                👥 추천 인원수 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="recommendedPlayers"
                name="recommendedPlayers"
                required
                value={formData.recommendedPlayers}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="예: 2-4명, 3-6명"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-bold text-purple-700 mb-2">
                📝 게임 설명 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={5}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="게임에 대한 설명을 입력하세요"
              />
            </div>

            <div>
              <label htmlFor="rulesUrl" className="block text-sm font-bold text-purple-700 mb-2">
                📖 게임 규칙 URL
              </label>
              <input
                type="url"
                id="rulesUrl"
                name="rulesUrl"
                value={formData.rulesUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://example.com/rules"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-purple-700 mb-3">
                🖼️ 게임 대표 이미지
              </label>
              
              {/* 업로드 방식 선택 */}
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setUploadMethod('file')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    uploadMethod === 'file'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  📱 파일 업로드
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMethod('url')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    uploadMethod === 'url'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  🔗 URL 입력
                </button>
              </div>

              {/* 파일 업로드 */}
              {uploadMethod === 'file' && (
                <div>
                  <label
                    htmlFor="imageFile"
                    className="block w-full px-4 py-8 border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-500 transition-colors cursor-pointer text-center bg-purple-50 hover:bg-purple-100"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">📸</span>
                      <span className="text-purple-700 font-medium">
                        클릭하여 이미지 선택
                      </span>
                      <span className="text-sm text-gray-500">
                        또는 이미지를 드래그하세요 (최대 5MB)
                      </span>
                    </div>
                  </label>
                  <input
                    type="file"
                    id="imageFile"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              )}

              {/* URL 입력 */}
              {uploadMethod === 'url' && (
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={handleUrlChange}
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              )}

              {/* 미리보기 */}
              {imagePreview && (
                <div className="mt-4 relative">
                  <p className="text-sm text-gray-600 mb-2">미리보기:</p>
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="미리보기" 
                      className="w-full h-48 object-cover rounded-lg border-2 border-purple-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      title="이미지 삭제"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl font-semibold"
              >
                <Save className="w-5 h-5" />
                {isEdit ? '수정 완료 ✅' : '등록하기 🎉'}
              </button>
              <Link
                to="/admin"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-300 transition-all font-semibold"
              >
                취소
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}