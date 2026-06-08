/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// App configuration loaded from environment variables
// In Vite, env vars must be prefixed with VITE_ to be exposed to client

const getEnv = (key: string, defaultValue: string) => {
  return import.meta.env[key] || defaultValue;
};

export const config = {
  // Text content
  title: getEnv('VITE_TITLE', 'Gửi đến Linh'),
  subtitle: getEnv('VITE_SUBTITLE', 'Dành tặng cho Linh'),
  tagline: getEnv('VITE_TAGLINE', 'Chúc mừng Ngày Phụ nữ Việt Nam 20/10'),
  
  // Welcome screen
  welcome: {
    heading: getEnv('VITE_WELCOME_HEADING', 'Thế Giới Tình Yêu'),
    subheading: getEnv('VITE_WELCOME_SUBHEADING', 'Chào mừng Linh đặt chân tới'),
    description: getEnv('VITE_WELCOME_DESCRIPTION', 'Anh đã thắp sáng hàng ngàn vì tinh tú và chế tác một khối tinh cầu pha lê tuyệt đẹp đón chờ em. Bật loa và bắt đầu hành trình nhé Linh thương mến của anh!'),
    buttonText: getEnv('VITE_WELCOME_BUTTON', 'Thắp Sáng Món Quà ❤️'),
  },

  // Audio playlist - configurable via env JSON string or defaults
  get playlist() {
    const playlistJson = import.meta.env.VITE_PLAYLIST;
    if (playlistJson) {
      try {
        return JSON.parse(playlistJson);
      } catch (e) {
        console.warn('Invalid VITE_PLAYLIST JSON, using defaults');
      }
    }
    return [
      {
        title: 'Tender Affection (Piano)',
        artist: 'Mixkit Instrumental',
        url: 'https://assets.mixkit.co/music/493/493.mp3',
        durationMs: 97000,
      },
      {
        title: 'Beautiful Dream (Calm)',
        artist: 'Mixkit Cinematic',
        url: 'https://assets.mixkit.co/music/688/688.mp3',
        durationMs: 123000,
      },
      {
        title: 'Love Is All Around',
        artist: 'Acoustic Melody',
        url: 'https://assets.mixkit.co/music/815/815.mp3',
        durationMs: 132000,
      },
    ];
  },

  // Default images for memories section
  get defaultImages() {
    const imagesJson = import.meta.env.VITE_DEFAULT_IMAGES;
    if (imagesJson) {
      try {
        return JSON.parse(imagesJson);
      } catch (e) {
        console.warn('Invalid VITE_DEFAULT_IMAGES JSON, using defaults');
      }
    }
    return [
      {
        id: 'def-photo-1',
        url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=650&auto=format&fit=crop',
        caption: 'Cầm tay anh đi khắp thế gian 💖',
        date: 'Ngày lành bên em',
      },
      {
        id: 'def-photo-2',
        url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=650&auto=format&fit=crop',
        caption: 'Tự vai ấm bình lặng giữa ngàn mây trôi 🌸',
        date: 'Kỷ niệm êm đềm',
      },
      {
        id: 'def-photo-3',
        url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=650&auto=format&fit=crop',
        caption: 'Mỗi nụ cười của em là ánh sáng rạng rỡ ✨',
        date: 'Giờ khắc đáng nhớ',
      },
    ];
  },

  // Letter content
  letter: {
    paragraphs: [
      getEnv('VITE_LETTER_PARA_1', 'Hôm nay là Ngày Phụ nữ Việt Nam 20/10, một ngày đặc biệt để cả thế giới tôn vinh phái đẹp, nhưng với anh, ngày nào có Linh bên cạnh cũng đều là ngày lành ngọt ngào ngọt ngào nhất.'),
      getEnv('VITE_LETTER_PARA_2', 'Từ khoảnh khắc em bước rạng ngời vào cuộc đời anh, tất cả những vụn vỡ sầu lặng cũ dường như lùi sâu vào dĩ vãng, nhường chỗ cho niềm tự hào, thắp sáng cả tâm hồn anh. Sự hiền hậu, thấu hiểu và nụ cười rạng rỡ của em chính là chốn bình lặng hoàn hảo nhất để anh luôn nương tựa tìm về sau những âu lo thường nhật của cuộc sống.'),
      getEnv('VITE_LETTER_PARA_3', 'Anh đã tạo nên không gian 3D lấp lánh này đại diện cho tình yêu của anh dành cho em. Trái tim pha lê rực đỏ ở trung tâm luôn quay xung quanh những dũng cảm, lời hứa tốt đẹp nhất dành cho em. Dù dòng thời gian có đổi thay, dù vũ trụ xoay chuyển thế nào, tình cảm tròn đầy và khao khát chở che em trong anh vẫn mãi vững bền như khối pha lê ấy.'),
      getEnv('VITE_LETTER_PARA_4', 'Chúc người yêu bé bỏng của anh đón chào một ngày 20/10 ngập tràn niềm tin, luôn rạng rõ như ngàn sao trời lấp lánh kia. Hãy nhớ rằng, trong bất kỳ hoàn cảnh nào, phía sau em sẽ luôn có vòng tay của anh vững chãi bảo vệ và yêu chiều em dạt dào nhất.'),
    ],
    greeting: getEnv('VITE_LETTER_GREETING', 'Linh thương mến của anh ❤️,'),
    signoff: getEnv('VITE_LETTER_SIGNOFF', 'Yêu Linh hơn ngàn vạn tinh cầu,\nChàng trai luôn bảo vệ em'),
  },

  // Promises content
  promises: [
    { text: getEnv('VITE_PROMISE_1', 'Luôn bảo vệ và yêu thương em vô điều kiện') },
    { text: getEnv('VITE_PROMISE_2', 'Luôn nhường nhịn và lắng nghe mọi tâm sự của em') },
    { text: getEnv('VITE_PROMISE_3', 'Nắm chặt tay em đi qua mọi giông bão cuộc đời') },
    { text: getEnv('VITE_PROMISE_4', 'Chăm sóc em mỗi khi mệt mỏi hay dỗi hờn') },
    { text: getEnv('VITE_PROMISE_5', 'Luôn dành cho em nụ cười ấm áp nhất mỗi ngày') },
  ],

  // Memories content
  memories: [
    {
      id: 'mem-1',
      title: getEnv('VITE_MEMORY_1_TITLE', 'Khoảnh khắc đầu tiên 🌸'),
      desc: getEnv('VITE_MEMORY_1_DESC', 'Lần đầu tiên anh nhìn vào mắt em, thế gian xung quanh như ngừng lại. Nụ cười tinh anh tỏa hương sắc riêng biệt khiến tim anh khẽ rung động.'),
      tag: getEnv('VITE_MEMORY_1_TAG', 'First Date'),
    },
    {
      id: 'mem-2',
      title: getEnv('VITE_MEMORY_2_TITLE', 'Nụ cười tỏa nắng ☀️'),
      desc: getEnv('VITE_MEMORY_2_DESC', 'Nụ cười của em là liều thuốc chữa lành tuyệt diệu nhất. Chỉ cần thấy em vui, mọi mệt mỏi tủi hờn của ngày dài trong anh đều tan biến.'),
      tag: getEnv('VITE_MEMORY_2_TAG', 'Sweet Smile'),
    },
    {
      id: 'mem-3',
      title: getEnv('VITE_MEMORY_3_TITLE', 'Gió mây bình yên 🌅'),
      desc: getEnv('VITE_MEMORY_3_DESC', 'Cùng nắm tay dạo bước, đón hoàng hôn lắng buông nhuộm hồng bờ vai nhỏ. Những giây phút bình dị bên Linh luôn là báu vật vô giá anh gìn giữ.'),
      tag: getEnv('VITE_MEMORY_3_TAG', 'Sunset Memories'),
    },
  ],

  // Orbit text configurations for GlassHeart3D
  orbits: [
    { id: 'orbit-1', text: getEnv('VITE_ORBIT_1', '❤️ LINH ❤️'), radius: 2.2, speed: 0.8, color: '#ff69b4', tiltX: 12, tiltZ: 8, direction: 1 as 1 | -1 },
    { id: 'orbit-2', text: getEnv('VITE_ORBIT_2', '❤️ MY LOVE ❤️'), radius: 3.1, speed: 0.6, color: '#ff1493', tiltX: -15, tiltZ: -10, direction: -1 as 1 | -1 },
    { id: 'orbit-3', text: getEnv('VITE_ORBIT_3', '❤️ 20-10 ❤️'), radius: 4.0, speed: 0.45, color: '#ff4d6d', tiltX: 8, tiltZ: -20, direction: 1 as 1 | -1 },
    { id: 'orbit-4', text: getEnv('VITE_ORBIT_4', '❤️ FOREVER ❤️'), radius: 4.9, speed: 0.35, color: '#ff85a1', tiltX: -22, tiltZ: 15, direction: -1 as 1 | -1 },
  ],
};