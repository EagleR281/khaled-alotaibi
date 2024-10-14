const audioPlayer = document.getElementById('audio-player');
const message = document.querySelector('.message');
const effectContainer = document.querySelector('.effect-container');
const muteButton = document.getElementById('mute-button');
const lyricsContainer = document.querySelector('.lyrics-container');
const overlay = document.getElementById('overlay');

let isMuted = false; // حالة الصوت
let isTyping = false; // حالة الكتابة

// كلمات الأغنية مع توقيتاتها
const lyrics = [
  { time: 1, text: "طيبها قسوة جفاها" },
  { time: 4, text: "ضحكها هيبة بكاها" },
  { time: 8, text: "روحها حدة ذكاها" },
  { time: 10, text: "تبلأك بالاسئله" },
];

// تشغيل الصوت عند أول ضغطة وإخفاء الرسالة
document.body.addEventListener('click', (e) => {
    if (audioPlayer.paused) {
        audioPlayer.play();
    }
    message.style.display = 'none';
    createEffect(e.pageX, e.pageY);
});

// إضافة تأثير في مكان الضغط
function createEffect(x, y) {
    const effect = document.createElement('div');
    effect.classList.add('effect');
    effect.textContent = '';

    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;

    effectContainer.appendChild(effect);

    // إزالة التأثير بعد 1.5 ثانية
    setTimeout(() => {
        effect.remove();
    }, 1500);
}

// نفترض أن لديك دالة تنتهي الأغنية فيها
function onSongEnd() {
    // إظهار الشاشة السوداء
    overlay.style.opacity = 1;

    // عرض كلمة "End"
    overlay.textContent = "End 🤍";

    // إعادة التوجيه إلى رابط الديسكورد بعد 1 ثانية
    setTimeout(() => {
        window.location.href = "https://discord.gg/jh4Qtzp8rd"; // إعادة التوجيه بعد 1 ثانية
    }, 1000);
}


// دالة لكتابة النص حرف بحرف
function typeEndText(text, interval) {
    let index = 0;

    const typeInterval = setInterval(() => {
        if (index < text.length) {
            overlay.textContent += text.charAt(index);
            index++;
        } else {
            clearInterval(typeInterval);
            isTyping = false;
        }
    }, interval);
}

// كتم الصوت أو فك الكتم
muteButton.addEventListener('click', () => {
    isMuted = !isMuted; // عكس حالة الصوت
    audioPlayer.muted = isMuted; // كتم الصوت

    // تغيير الأيقونة حسب الحالة
    muteButton.textContent = isMuted ? '🔇' : '🔊';
});

// تحديث عرض الكلمات
let lastDisplayedTime = 0;

audioPlayer.addEventListener('timeupdate', () => {
    const currentTime = audioPlayer.currentTime;

    // البحث عن الكلمة المناسبة
    const currentLyric = lyrics.find(lyric => lyric.time <= currentTime && currentTime < (lyric.time + 3));

    if (currentLyric && currentLyric.time !== lastDisplayedTime) {
        lastDisplayedTime = currentLyric.time; // تحديث وقت الكلمة المعروضة
        lyricsContainer.textContent = currentLyric.text; // عرض الكلمة الحالية

        // تحديد موضع عشوائي على الشاشة
        const randomX = Math.random() * (window.innerWidth - lyricsContainer.offsetWidth);
        const randomY = Math.random() * (window.innerHeight - lyricsContainer.offsetHeight);

        lyricsContainer.style.left = `${randomX}px`;
        lyricsContainer.style.top = `${randomY}px`;

        lyricsContainer.classList.add('zoom');
        lyricsContainer.style.opacity = 1;

        // إخفاء الكلمات بعد 2 ثانية
        setTimeout(() => {
            lyricsContainer.classList.remove('zoom');
            lyricsContainer.style.opacity = 0;
        }, 2000);
    }
});

// حدث نهاية الأغنية
audioPlayer.addEventListener('ended', onSongEnd);
