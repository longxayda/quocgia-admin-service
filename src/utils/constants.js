// src/utils/constants.js
// Keep RANKING_TYPES in sync with frontend HeritageManagement dropdown (or use GET /api/constants/ranking-types).

const SUPPORTED_LANGUAGES = [
  { code: 'vi', name: 'Tiếng Việt', ttsCode: 'vi-VN' },
  { code: 'km', name: 'ភាសាខ្មែរ (Khmer)', ttsCode: 'km-KH' },
  { code: 'en', name: 'English', ttsCode: 'en-US' },
  { code: 'zh', name: '中文 (Hoa)', ttsCode: 'zh-CN' },
];

const RANKING_TYPES = [
  'Quốc gia đặc biệt',
  'Quốc gia',
  'Cấp tỉnh',
];

module.exports = {
  SUPPORTED_LANGUAGES,
  RANKING_TYPES,
};