export interface AnimalAvatar {
  id: string;
  name: string;
  url: string;
}

const BASE_URL = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals';

export const ANIMAL_AVATARS: AnimalAvatar[] = [
  {
    id: 'panda',
    name: 'Gấu trúc',
    url: `${BASE_URL}/Panda.png`,
  },
  {
    id: 'cat',
    name: 'Mèo quý tộc',
    url: `${BASE_URL}/Cat%20Face.png`,
  },
  {
    id: 'dog',
    name: 'Cún Shiba',
    url: `${BASE_URL}/Dog%20Face.png`,
  },
  {
    id: 'fox',
    name: 'Cáo lém lỉnh',
    url: `${BASE_URL}/Fox.png`,
  },
  {
    id: 'lion',
    name: 'Sư tử oai vệ',
    url: `${BASE_URL}/Lion.png`,
  },
  {
    id: 'tiger',
    name: 'Hổ dũng mãnh',
    url: `${BASE_URL}/Tiger%20Face.png`,
  },
  {
    id: 'rabbit',
    name: 'Thỏ ngọc',
    url: `${BASE_URL}/Rabbit%20Face.png`,
  },
  {
    id: 'bear',
    name: 'Gấu nâu',
    url: `${BASE_URL}/Bear.png`,
  },
  {
    id: 'koala',
    name: 'Gấu túi Koala',
    url: `${BASE_URL}/Koala.png`,
  },
  {
    id: 'penguin',
    name: 'Chim cánh cụt',
    url: `${BASE_URL}/Penguin.png`,
  },
  {
    id: 'owl',
    name: 'Cú đêm luyện phim',
    url: `${BASE_URL}/Owl.png`,
  },
  {
    id: 'wolf',
    name: 'Sói tuyết',
    url: `${BASE_URL}/Wolf.png`,
  },
];

export const DEFAULT_AVATAR = ANIMAL_AVATARS[0];

export function getAvatarUrl(avatarIdOrUrl?: string | null): string {
  if (!avatarIdOrUrl) return DEFAULT_AVATAR.url;
  if (avatarIdOrUrl.startsWith('http://') || avatarIdOrUrl.startsWith('https://')) {
    return avatarIdOrUrl;
  }
  const matched = ANIMAL_AVATARS.find((a) => a.id === avatarIdOrUrl);
  return matched ? matched.url : DEFAULT_AVATAR.url;
}
