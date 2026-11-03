# 偽書堂 公式サイト — GitHub Pages版

ミステリー・ホラーゲーム制作サークル「偽書堂」の公式サイトです。

## 収録ファイル

- `index.html` — トップページ（HOME / GAME / ABOUT / NEWS / CONTACT）
- `styles.css` — PC/スマホ対応レイアウト、カラー、アニメーション
- `script.js` — ロゴフェード、モバイルメニュー、作品詳細、リンク・お知らせ表示
- `site.config.js` — **公開URL・SNS・お知らせ・オープニング設定**
- `assets/gishodo-logo.png` — ご提供いただいたロゴ画像（透過の余白だけトリミング）
- `assets/hero-window.webp` — 新規生成した、フラット塗りの窓辺の背景イラスト部分
- `assets/breakfast-cover.svg`、`assets/mystery-cover.svg` — 作品紹介カードの仮イラスト。公開時に実際のキービジュアルへ置き換え可能
- `assets/og-image.jpg`、`favicon.svg` — SNS共有用画像とタブアイコン

## GitHub Pagesへの公開方法

1. GitHubに公開用リポジトリを作成します（例：`gishodo-site`）。
2. ZIPの**中にあるファイル・フォルダをすべて**リポジトリのルートにアップロードします。ZIPファイルそのものをアップロードするのではありません。
3. GitHubのリポジトリで **Settings → Pages → Build and deployment → Deploy from a branch** を選択します。
4. Branchを `main`、フォルダを `/(root)` にして保存します。
5. GitHub Pagesから公開URLが発行されます。例：`https://USERNAME.github.io/gishodo-site/`

`index.html` がリポジトリの一番上にあることを確認してください。

## 公開する前に編集する箇所

### 作品のプレイページ・SNSリンク

`site.config.js` にある `links` にURLを入れてください。

```js
links: {
  breakfast: 'https://公開先のURL',
  mystery: '',
  x: 'https://x.com/ユーザー名',
  note: 'https://note.com/ユーザー名',
  youtube: '',
  email: 'mailto:your@example.com'
}
```

空文字のものは表示されません。**未設定のURLへ飛ぶダミーボタンはありません。**

### お知らせ

`site.config.js` の `news` に追加します。

```js
news: [
  { date: '2026.11.01', category: '公開', title: '新作ゲームを公開しました。', url: 'https://...' }
]
```

この例はサンプルで、実際の発表日とURLに置き換えてください。

### ロゴオープニング

`site.config.js` の `introMode` で切り替えられます。

- `'session'` — 新しいタブでの初回表示時のみ。ページ更新時には繰り返しません（初期設定）
- `'always'` — 読み込むたびにアニメーションを表示
- `'off'` — アニメーションを表示しない

初回は中央のロゴがフェードインし、約2.8秒後にページへ移ります。右下の `SKIP` ですぐに進めます。「動きを減らす」がONの端末ではアニメーションを省略します。

### 作品画像

作品画像を実際のキービジュアルに差し替えるには、`assets` に画像を追加して `index.html` の `assets/breakfast-cover.svg`、`assets/mystery-cover.svg` のパスを書き換えます。

### ページ文章

`index.html` 内の紹介文は自由に編集できます。作品紹介の「制作中」はサンプル状態なので、実際の公開状況に合わせて更新してください。

## 補足

- 外部ライブラリなし。HTML / CSS / JavaScriptのみで動作します。
- リンクは、未設定の場合非表示になります。
- サイトの色はすべて指定の16色パレット由来です（透明度違いを含む）。
- ヒーロー背景は新規生成イラストから文字のない部分を切り出して使用しています。
- GitHub Pagesは静的サイトの公開機能です。**公開作業自体は含まれません。**


## 追加：遠廼まち プロフィールページ（2026-10-31）

既存のトップページで編集された文章・配色・ロゴ・ゲーム情報などは維持したうえで、次を追加しました。

- `profile.html` — プロフィール専用ページ（ゲーム作品一覧の重複掲載なし）
- `profile.css` — プロフィール固有のデザイン・スマホ対応
- `profile.js` — プロフィール側のスマホメニュー
- `assets/toono-machi-icon.png` — 提供されたアイコン画像を再描画せず使用
- `index.html` — PC/スマホのナビゲーションに `PROFILE` を追加。「CREATOR 遠廼まち」からも遷移可能
- `styles.css` — 上記リンクのスタイルのみ追記。元の調整済みスタイルは保持

### 配置・公開方法

`profile.html`、`profile.css`、`profile.js`、`assets/toono-machi-icon.png` を**トップページと同じ階層**に設置してください。
GitHub Pagesでは `https://ユーザー名.github.io/リポジトリ名/profile.html` に表示されます。
プロフィールは別ページなので、トップのロゴフェード演出を再生しません。トップページの既存起動アニメーションは変更していません。

### 内容の変更方法

プロフィールの文章は `profile.html` から変更できます。ロゴ等、既存サイトの共通スタイルは `styles.css`、プロフィールだけのデザインは `profile.css` です。実在しないSNSリンクは追加していません。


## 『最■の朝食を、君に。』作品ページの追加

- `breakfast.html` / `breakfast.css` / `breakfast.js` が新規ページです。
- サークルトップの「公式作品ページ」から移動できます。
- キャラクター画像をクリックすると全身モーダルが開き、左右の矢印とキーボード矢印で移動します。
- 「彼」の画像は提供された全身素材、「？？？」は提供された鑑定士の立ち絵の輪郭から作成したシルエットです。
- 主人公の容姿は作品設定に合わせて公開せず、拡大時も非公開表示です。
- スクリーンショット枠は実機画面が未提供のため、提供済み背景素材に「準備中」表示を重ねています。公開時に `breakfast.html` 内の `bf-shot-card` の画像を差し替え、準備中表示を外してください。
- 配布先URLは `site.config.js` の `links.breakfast` に入れると配布ボタンへ反映されます。
- END 3種の名前とヒントはボタン操作でのみ展開します。
- HTML内のスタッフクレジットは現在判明している制作体制の仮記載です。必要に応じて公開前に確認・編集してください。
- GitHub Pagesには展開後のサークルHPディレクトリ**内のファイル**をアップロードしてください。


## タイトルイラスト更新
新しい作品タイトルイラスト `assets/breakfast-hero-banner.webp` を `breakfast.html` のヘッダーに設定しました（2048×768）。PCではイラスト全体を表示し、スマートフォンではロゴや人物の切れを防ぐため従来の縦長構成を使います。
