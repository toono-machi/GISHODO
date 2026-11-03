/*
 * 偽書堂 公式サイト設定
 * GitHub Pagesに公開後もこのファイルを編集するだけでリンクやお知らせを変更できます。
 * 空のURLは自動的に非表示になります。リンクを設定するまでダミーの行き先は表示しません。
 */
window.GISHODO_SITE = {
  // 'session': タブを開いた最初の訪問だけ表示 / 'always': 読み込みごと / 'off': 無効
  introMode: 'session',
  links: {
    breakfast: '', // 例: 'https://novelgame.jp/games/show/12345'
    mystery: '',   // 各作品の公開URL
    x: '',         // 例: 'https://x.com/your_account'
    note: '',      // 例: 'https://note.com/your_account'
    youtube: '',   // 例: 'https://www.youtube.com/@your_channel'
    email: ''      // 例: 'mailto:example@example.com'
  },
  // 新しいお知らせは上から追加してください（実在するお知らせのみを設定）。
  news: [
    // { date: '2026.11.01', category: '公開', title: '「作品名」を公開しました。', url: 'https://...' },
  ]
};
