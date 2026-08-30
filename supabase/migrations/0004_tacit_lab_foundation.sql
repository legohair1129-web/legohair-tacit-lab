-- TACIT LAB foundation: MASTER KNOWLEDGE library + TACIT STRENGTHS diagnosis.
-- Additive only: no existing table/column is dropped, renamed, or retyped.
-- Follows the existing RLS convention (public.is_admin() helper, explicit
-- select/insert/update policies per table, no RLS disabling). Same-user
-- writes (assessments/answers/results/profile) rely on RLS directly, the
-- same way `cases`/`case_reviews` do — no security-definer RPC is needed
-- here because no privilege boundary is crossed (see admin_set_pickup in
-- 0001_init.sql for the one case that does need one).
--
-- Human-review note: no quotes/statements are attributed to any named
-- external hairdresser in this seed data — benchmark_reference is left
-- null for every master_knowledge row because no verified source has been
-- confirmed. The column exists so an admin can attach a real citation later.

-- ---------------------------------------------------------------------------
-- profiles: one additive column for the one-time onboarding gate
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column tacit_lab_intro_seen_at timestamptz;

-- ---------------------------------------------------------------------------
-- strength_types — the 8 TACIT STRENGTHS
-- ---------------------------------------------------------------------------
create table public.strength_types (
  key text primary key,
  name_ja text not null,
  name_en text not null,
  description text not null,
  gift_text text not null,
  watch_out_text text not null,
  sort_order int not null default 0
);

alter table public.strength_types enable row level security;

create policy strength_types_select on public.strength_types
  for select using (auth.role() = 'authenticated');

create policy strength_types_insert on public.strength_types
  for insert with check (public.is_admin(auth.uid()));

create policy strength_types_update on public.strength_types
  for update using (public.is_admin(auth.uid()));

create policy strength_types_delete on public.strength_types
  for delete using (public.is_admin(auth.uid()));

insert into public.strength_types (key, name_ja, name_en, description, gift_text, watch_out_text, sort_order) values
  ('observer', '観察者', 'OBSERVER',
   '言葉になる前の変化に気づく。仕草、目線、手の動き、服装、表情など。',
   'まだ言葉になっていないサインに気づけること。',
   '観察したことを「正解」と決めつけないこと。',
   10),
  ('empathizer', '共感者', 'EMPATHIZER',
   '感情、不安、迷いを受け取る。',
   'お客様が言葉にできない気持ちに、先に寄り添えること。',
   '共感が先行しすぎて、必要な提案を後回しにしないこと。',
   20),
  ('insighter', '洞察者', 'INSIGHTER',
   '言葉の奥にある欲求や理由を探る。',
   '表面的な要望の、その奥にある本音を見抜けること。',
   '推測を確認せずに、決めつけで終わらせないこと。',
   30),
  ('designer', '魅力設計者', 'DESIGNER',
   '顔・髪・骨格・色・ファッションなどを統合し、魅力を設計する。',
   '要素をばらばらに見ず、全体として魅力を組み立てられること。',
   '技術的な正しさだけで、本人の希望を置き去りにしないこと。',
   40),
  ('solver', '解決者', 'SOLVER',
   '髪質・ダメージ・毛量などの制約から実現方法を探す。',
   '制約があるほど、実現の道筋を見つけられること。',
   '実現できることに満足して、本当に必要かの確認を忘れないこと。',
   50),
  ('connector', '伝達者', 'CONNECTOR',
   'プロの見立てを、お客様が理解できる言葉へ変換する。',
   '専門的な判断を、相手に伝わる言葉に変えられること。',
   '伝えることに集中しすぎて、聞くことを後回しにしないこと。',
   60),
  ('life_designer', '日常設計者', 'LIFE DESIGNER',
   '仕事・家庭・朝の時間・お手入れ・再現性まで考える。',
   'サロンの中だけでなく、お客様の日常まで想像できること。',
   '日常への配慮が、提案の大胆さを奪わないよう気をつけること。',
   70),
  ('developer', '伴走者', 'DEVELOPER',
   '一回の施術で終わらず、数ヶ月先までお客様とゴールを作る。',
   '今日だけでなく、この先までお客様と一緒に見られること。',
   '長期の視点にこだわりすぎて、今日の一回を軽くしないこと。',
   80);

-- ---------------------------------------------------------------------------
-- strength_combination_types — DUAL TYPE naming (section 17)
-- ---------------------------------------------------------------------------
create table public.strength_combination_types (
  id uuid primary key default gen_random_uuid(),
  type_a_key text not null references public.strength_types (key),
  type_b_key text not null references public.strength_types (key),
  name_ja text not null,
  description text not null,
  unique (type_a_key, type_b_key)
);

alter table public.strength_combination_types enable row level security;

create policy strength_combination_types_select on public.strength_combination_types
  for select using (auth.role() = 'authenticated');

create policy strength_combination_types_insert on public.strength_combination_types
  for insert with check (public.is_admin(auth.uid()));

create policy strength_combination_types_update on public.strength_combination_types
  for update using (public.is_admin(auth.uid()));

create policy strength_combination_types_delete on public.strength_combination_types
  for delete using (public.is_admin(auth.uid()));

insert into public.strength_combination_types (type_a_key, type_b_key, name_ja, description) values
  ('observer', 'insighter', '見抜く人', '見えているサインから、その奥にある本音まで見抜くタイプ。'),
  ('empathizer', 'connector', '安心をつくる人', '気持ちに寄り添い、それを言葉にして安心をつくるタイプ。'),
  ('designer', 'solver', '実現するデザイナー', '理想の魅力を、制約の中でも実現に落とし込むタイプ。'),
  ('life_designer', 'developer', '人生伴走型', 'お客様の日常に寄り添い、長い時間をかけて伴走するタイプ。'),
  ('observer', 'designer', '魅力発見型', '小さな変化への気づきを、魅力の設計に変えるタイプ。'),
  ('insighter', 'empathizer', '深層共感型', '本音を見抜く力と、気持ちに寄り添う力を併せ持つタイプ。');

-- ---------------------------------------------------------------------------
-- master_knowledge — the ~20 core learning articles
-- ---------------------------------------------------------------------------
create table public.master_knowledge (
  id uuid primary key default gen_random_uuid(),
  number int not null unique,
  title text not null,
  principle text not null,
  case_text text not null,
  question text not null,
  master_view text not null,
  key_insight text not null,
  observation_points text[] not null default '{}',
  benchmark_reference jsonb,
  legohair_interpretation text not null,
  related_strength_keys text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.master_knowledge enable row level security;

create policy master_knowledge_select on public.master_knowledge
  for select using (auth.role() = 'authenticated');

create policy master_knowledge_insert on public.master_knowledge
  for insert with check (public.is_admin(auth.uid()));

create policy master_knowledge_update on public.master_knowledge
  for update using (public.is_admin(auth.uid()));

create policy master_knowledge_delete on public.master_knowledge
  for delete using (public.is_admin(auth.uid()));

insert into public.master_knowledge
  (number, title, principle, case_text, question, master_view, key_insight, observation_points, legohair_interpretation, related_strength_keys, sort_order)
values
  (1, 'カウンセリングには「0秒目」がある',
   '会話が始まる前、お客様が椅子に座った瞬間からカウンセリングは始まっている。',
   '予約時間ちょうどに来店したお客様。挨拶をする前に、鏡越しに視線を合わせようとしている。',
   'あなたなら、最初の言葉を発する前に何を見ますか？',
   '表情・視線・座り方・荷物の置き方。言葉より先に体が発しているサインを拾う。',
   '観察 → 会話設計、という順番を意識する。',
   ARRAY['表情', '視線の動き', '座り方・姿勢', '荷物の置き方'],
   'LEGOHAIRでは、挨拶の言葉を選ぶ前の数秒を「0秒目」と呼ぶ。ここでの観察が、その後のカウンセリングの質を決める。',
   ARRAY['observer', 'insighter'], 10),
  (2, 'カルテは接客温度を決めるセンサー',
   'カルテの記入内容の温度感（丁寧さ、書き込み量）が、その日の接客の温度を教えてくれる。',
   '初回カウンセリングシートの自由記入欄が、いつもより一言少ない常連のお客様。',
   'この「一言少なさ」から、何を仮説として持ちますか？',
   '情報量の変化は、心理的な余裕や関心の変化のサイン。書かれていないことにこそ注目する。',
   '記入量の変化 → 心理状態の変化、という視点。',
   ARRAY['記入量の増減', '筆跡の強さ', '空欄の位置', '前回との比較'],
   'カルテは「情報を集める道具」ではなく「今日の状態を測るセンサー」として使う。',
   ARRAY['observer', 'empathizer'], 20),
  (3, '髪より先に「手」を見る',
   'お客様の手や仕草は、髪の状態よりも早く本音を語る。',
   'セット面に座った瞬間から、毛先を指で挟んで確認しているお客様。',
   '髪を見る前に、まず何を確認しますか？',
   '触れている場所（毛先／前髪／根元）で、気にしているポイントが変わる。',
   '触れる場所 → 気になっている部位、という対応関係を持つ。',
   ARRAY['手が触れている位置', '触れる頻度', '力の入り方', '視線と手の連動'],
   '「髪を見る前に、手を見る」は観察の順番を変えるだけの、すぐに使える技術。',
   ARRAY['observer', 'solver'], 30),
  (4, '観察をファーストタッチに変える',
   '観察して終わりにせず、観察した内容を最初のひと言に変換する。',
   '毛先を気にする仕草に気づいたが、何と声をかけていいか分からない。',
   'この観察を、どんな最初のひと言に変えますか？',
   '断定せず、仮説として差し出す。「毛先、気になりますか？」など、確認できる言葉にする。',
   '観察 → 仮説 → 確認できる言葉、という3段階。',
   ARRAY['断定を避ける言い回し', 'はい/いいえで答えやすい質問', 'お客様の反応を待つ間', '表情の変化'],
   '観察したことをすぐ言葉にする練習が、カウンセリングの精度を上げる。',
   ARRAY['observer', 'connector'], 40),
  (5, '本音は質問だけでは引き出さない',
   '質問攻めにするほど、本音は遠ざかる。観察と沈黙も情報収集の手段。',
   '「特にないです」としか答えないお客様。',
   '追加で質問する以外に、何ができますか？',
   '沈黙を埋めず、選択肢や具体例を先に見せて反応を観察する。',
   '質問 → 沈黙 → 反応の観察、という組み合わせ。',
   ARRAY['沈黙の長さ', '視線の泳ぎ方', '具体例への反応', '言い淀み'],
   '「答えてもらう」より「反応を見せてもらう」ことを目的にする場面がある。',
   ARRAY['empathizer', 'insighter'], 50),
  (6, 'プロの見立てを先に差し出す',
   '「どうしたいですか」より先に、プロとしての見立てを提示すると本音が引き出しやすくなる。',
   '「お任せします」と言われたが、表情には迷いが見える。',
   'お任せと言われた直後、何を差し出しますか？',
   'こちらの見立てを先に言葉にして提示し、反応で本音を確認する。',
   '見立てを先に出す → 反応で調整する、という流れ。',
   ARRAY['提案への表情変化', '頷きの深さ', '言葉での同意と表情のズレ', '沈黙の質'],
   '「お任せ」は思考停止ではなく、判断をプロに委ねたいという意思表示として受け取る。',
   ARRAY['insighter', 'connector'], 60),
  (7, '共有→共感→提案→再仮説',
   '見立てはこの順番で伝えると受け取ってもらいやすい。',
   '今日気づいたことを伝えたいが、どこから話すか迷う。',
   '何から話し始めますか？',
   'まず観察したことを共有し、次に気持ちに共感し、その後に提案し、反応を見て仮説を更新する。',
   '共有 → 共感 → 提案 → 再仮説、というサイクル。',
   ARRAY['伝える順番', '共感の言葉の有無', '提案のタイミング', '反応後の軌道修正'],
   'このサイクルを1回で終わらせず、施術中に何度も回すのがLEGOHAIR流。',
   ARRAY['connector', 'insighter'], 70),
  (8, '写真は「オーダー」ではなく「憧れ」',
   '持参写真はそのまま再現する指示ではなく、憧れている要素のヒント。',
   '明らかに髪質が違うモデルの写真を持ってきたお客様。',
   'この写真から、何を読み取りますか？',
   '髪型そのものより、写真から伝わる雰囲気・印象・生き方への憧れを読み取る。',
   '写真 → 要素分解 → 憧れの本体を探す。',
   ARRAY['写真のどの部分を指しているか', '説明する時の言葉', '表情の高揚', '似合わせとのギャップ'],
   '「同じにはできない」で終わらせず、「この要素なら実現できる」に変換する。',
   ARRAY['designer', 'insighter'], 80),
  (9, '「お任せ」をそのまま受け取らない',
   '「お任せします」の裏には、言葉にできない希望が隠れていることが多い。',
   '毎回「お任せで」と言うが、仕上がりに小さな注文をつけるお客様。',
   'このパターンから何を学びますか？',
   '「お任せ」は白紙委任ではなく、選択の負担を減らしてほしいというサイン。',
   'お任せ → 負担軽減の希望、という読み替え。',
   ARRAY['仕上がり後の細かい要望', 'お任せと言うタイミング', '過去の反応履歴', '言葉と満足度のギャップ'],
   'お任せの裏にある「軽い希望」を汲み取れるかが信頼を左右する。',
   ARRAY['empathizer', 'insighter'], 90),
  (10, '顔だけを見て似合わせない',
   '似合わせは顔だけでなく、骨格・姿勢・雰囲気・服装まで含めて設計する。',
   '顔立ちには似合うはずのスタイルが、なぜか馴染まないお客様。',
   '顔以外に、何を見ますか？',
   '肩幅や姿勢、服の系統、話し方の雰囲気まで含めて全体のバランスを見る。',
   '顔 → 全体、へ視野を広げる。',
   ARRAY['骨格・姿勢', '服装の系統', 'アクセサリーの好み', '話し方や仕草の雰囲気'],
   '「似合う」を顔のパーツ論で終わらせないのがLEGOHAIRの似合わせ観。',
   ARRAY['designer', 'observer'], 100),
  (11, '「どう見られたいか」までデザインする',
   '髪型は見た目の結果ではなく、どう見られたいかという意思表示のデザイン。',
   '転職を控えているとぽつりと話したお客様。',
   'このひと言から、デザインに何を反映しますか？',
   'これから会う人にどう見られたいかを一緒に言語化し、髪型に落とし込む。',
   '状況の変化 → 見られたい自分 → デザイン、という流れ。',
   ARRAY['生活の変化を示す発言', '言葉の選び方', '写真や参考例への反応', '希望する印象のキーワード'],
   '「なりたい自分」ではなく「見られたい自分」という表現を使うのがLEGOHAIR流。',
   ARRAY['designer', 'life_designer'], 110),
  (12, '定型的な似合わせから一度離れる',
   '「丸顔にはこのスタイル」といった定石は出発点であって答えではない。',
   '定石通りのスタイルを提案したが、反応が薄いお客様。',
   '定石が響かない時、何を見直しますか？',
   '定石を一度手放し、その人固有の雰囲気や希望に立ち返って再設計する。',
   '定石 → 反応観察 → 再仮説、のサイクルを止めない。',
   ARRAY['提案への反応の薄さ', '定石と本人の雰囲気のズレ', '言葉にならない違和感', '過去スタイルの傾向'],
   '定石はスタート地点。そこで思考を止めないことが「似合わせ」の本質。',
   ARRAY['designer', 'insighter'], 120),
  (13, '魅力を最後まで一つ残しておく',
   '全ての要望に応えて均一に整えるより、その人らしい魅力を一つ意図的に残す。',
   'クセを完全に伸ばしたいと希望するお客様。',
   'すべて叶える以外に、何を提案しますか？',
   'クセの一部を魅力として活かす提案をし、選択肢として残す。',
   '均一化 → 個性の一部保持、という設計判断。',
   ARRAY['本人が気にしている部分', '第三者が魅力と感じる部分のギャップ', '提案への反応', '過去の満足度'],
   '「直す」だけでなく「活かす」視点を一つ持っておく。',
   ARRAY['designer', 'developer'], 130),
  (14, 'できないを関係の終わりにしない',
   '技術的にできないことを伝える瞬間こそ、信頼関係を築くチャンス。',
   '一回でのブリーチ毛の完全ダメージレスは難しいと伝える必要があるお客様。',
   '「できない」をどう伝えますか？',
   'できない理由と一緒に、できる代替案と今後の見通しを必ずセットで伝える。',
   'できない → 理由 → 代替案 → 見通し、の順で伝える。',
   ARRAY['伝えた直後の表情', '代替案への反応', '見通しへの安心度', '次回来店の意思'],
   '「できません」で終わる会話を、LEGOHAIRでは失敗と捉える。',
   ARRAY['solver', 'connector'], 140),
  (15, '「決めないこと」もカウンセリングで決める',
   'すべてをその日に決めさせるのではなく、決めない選択肢を用意することもカウンセリング。',
   'カラーを変えるか悩み続けているお客様。',
   '迷いが続く時、何を提案しますか？',
   '「今日は決めない」という選択肢を提示し、次回に向けた準備だけ進める。',
   '決断の強制 → 猶予の提案、という発想の転換。',
   ARRAY['迷いの深さ', '時間的プレッシャーの有無', '決めない提案への反応', '次回への言及'],
   '決めさせないことも、お客様の日常を守るための判断。',
   ARRAY['empathizer', 'life_designer'], 150),
  (16, 'お客様に頑張ってもらわない',
   '再現性のあるスタイルとは、お客様が特別な努力をしなくても保てるスタイル。',
   'サロンでは綺麗だが、自宅では再現できないと話すお客様。',
   '何を基準にスタイルを見直しますか？',
   'お客様の朝の時間・技術・道具を基準に、再現可能な形に設計し直す。',
   'サロン基準 → 生活基準、への設計転換。',
   ARRAY['朝の準備時間', '自宅にある道具', 'スタイリングの技術レベル', '再現できない箇所の具体性'],
   '「頑張れば再現できる」は、LEGOHAIRでは再現性があるとは呼ばない。',
   ARRAY['life_designer', 'solver'], 160),
  (17, '技術より先に「日常」を知る',
   '技術的な提案の前に、お客様の日常（仕事・家庭・時間の使い方）を知る。',
   '役職が変わったとだけ話すお客様。',
   'この情報から、次に何を聞きますか？',
   '新しい役職での一日の過ごし方や、人と会う頻度など、日常の変化を具体的に聞く。',
   '状況の変化 → 日常の変化 → 技術的な提案、の順番。',
   ARRAY['生活の変化を示す発言', '時間の使い方への言及', '人と会う頻度の変化', '服装や持ち物の変化'],
   '技術はいつでも学べるが、日常への関心は意識しないと育たない。',
   ARRAY['life_designer', 'insighter'], 170),
  (18, '今年この人は「誰として生きるのか」',
   '一回の施術ではなく、その年その人がどんな役割・立場で生きていくのかという視点でデザインする。',
   '子育てが一段落し、新しいことを始めたいと話すお客様。',
   'この一年をどう捉えて提案しますか？',
   '今日のスタイルだけでなく、これから半年〜一年の変化の予兆として捉える。',
   '今日の施術 → 一年単位の変化、へ視座を上げる。',
   ARRAY['長期的な発言', '生活の節目を示す言葉', 'これまでとの一貫性・変化', '今後の予定への言及'],
   '「今年、この人は誰として生きるのか」を考えるのがLEGOHAIRのデザイン思考。',
   ARRAY['life_designer', 'developer'], 180),
  (19, '次回来店のビフォーから前回を評価する',
   '前回の施術の良し悪しは、次回来店した時の「ビフォー」の状態で評価する。',
   '2ヶ月ぶりに来店し、以前よりも髪を大切に扱っている様子のお客様。',
   'このビフォーの状態から、前回の施術をどう評価しますか？',
   '次回のビフォーが前回より良ければ、前回の提案は成功と捉える。',
   '前回のアフター評価 → 次回のビフォー評価、へ評価軸を移す。',
   ARRAY['来店時の髪の状態', 'スタイリングへの取り組み方の変化', '自宅ケアの様子', '本人の言葉での振り返り'],
   '「今日のアフター」ではなく「次回のビフォー」で自分の仕事を採点する。',
   ARRAY['developer', 'life_designer'], 190),
  (20, '美容師の仕事は、人の日常を少し良くすること',
   'カット・カラー・パーマは手段であり、目的はお客様の日常を少し良くすること。',
   '技術的には満足のいく仕上がりだが、お客様の反応が控えめだった。',
   '技術の完成度と、お客様の満足は何が違うのでしょうか？',
   '満足は「今日の見た目」ではなく「これからの日常がどう変わるか」で測られる。',
   '技術の評価軸 → 日常の変化という評価軸、への転換。',
   ARRAY['仕上がり直後の反応', '日常生活への言及の有無', '次回来店時の変化', '本人の言葉での評価'],
   '「最高のビフォーをつくる。」という言葉は、この一文に集約される。',
   ARRAY['developer', 'designer', 'life_designer'], 200);

-- ---------------------------------------------------------------------------
-- master_knowledge_responses — free-text answers before/after MASTER'S VIEW
-- ---------------------------------------------------------------------------
create table public.master_knowledge_responses (
  id uuid primary key default gen_random_uuid(),
  master_knowledge_id uuid not null references public.master_knowledge (id),
  staff_id uuid not null references public.profiles (id),
  response_text text not null,
  is_anonymous boolean not null default false,
  created_at timestamptz not null default now(),
  unique (master_knowledge_id, staff_id)
);

create index master_knowledge_responses_knowledge_idx on public.master_knowledge_responses (master_knowledge_id);

alter table public.master_knowledge_responses enable row level security;

-- Peer visibility ("OTHER VIEWS") is a spec requirement — the UI, not RLS,
-- hides the author's name when is_anonymous = true.
create policy master_knowledge_responses_select on public.master_knowledge_responses
  for select using (auth.role() = 'authenticated');

create policy master_knowledge_responses_insert on public.master_knowledge_responses
  for insert with check (staff_id = auth.uid());

create policy master_knowledge_responses_update on public.master_knowledge_responses
  for update using (staff_id = auth.uid());

-- ---------------------------------------------------------------------------
-- strength_questions / strength_options / strength_option_scores
-- ---------------------------------------------------------------------------
create table public.strength_questions (
  id uuid primary key default gen_random_uuid(),
  number int not null unique,
  scenario_text text not null,
  weight numeric not null default 1.0,
  sort_order int not null default 0
);

alter table public.strength_questions enable row level security;

create policy strength_questions_select on public.strength_questions
  for select using (auth.role() = 'authenticated');

create policy strength_questions_insert on public.strength_questions
  for insert with check (public.is_admin(auth.uid()));

create policy strength_questions_update on public.strength_questions
  for update using (public.is_admin(auth.uid()));

create policy strength_questions_delete on public.strength_questions
  for delete using (public.is_admin(auth.uid()));

create table public.strength_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.strength_questions (id),
  option_key text not null check (option_key in ('A', 'B', 'C', 'D')),
  option_text text not null,
  unique (question_id, option_key)
);

alter table public.strength_options enable row level security;

create policy strength_options_select on public.strength_options
  for select using (auth.role() = 'authenticated');

create policy strength_options_insert on public.strength_options
  for insert with check (public.is_admin(auth.uid()));

create policy strength_options_update on public.strength_options
  for update using (public.is_admin(auth.uid()));

create policy strength_options_delete on public.strength_options
  for delete using (public.is_admin(auth.uid()));

create table public.strength_option_scores (
  id uuid primary key default gen_random_uuid(),
  option_id uuid not null references public.strength_options (id),
  strength_type_key text not null references public.strength_types (key),
  score int not null,
  unique (option_id, strength_type_key)
);

alter table public.strength_option_scores enable row level security;

create policy strength_option_scores_select on public.strength_option_scores
  for select using (auth.role() = 'authenticated');

create policy strength_option_scores_insert on public.strength_option_scores
  for insert with check (public.is_admin(auth.uid()));

create policy strength_option_scores_update on public.strength_option_scores
  for update using (public.is_admin(auth.uid()));

create policy strength_option_scores_delete on public.strength_option_scores
  for delete using (public.is_admin(auth.uid()));

-- 25 questions. #24/#25 are self-reflection questions and carry half weight.
insert into public.strength_questions (number, scenario_text, weight, sort_order) values
  (1, '初めて来店されたお客様。カウンセリングシートの自由記入欄がほとんど空欄です。', 1.0, 10),
  (2, '常連のお客様が、今日は毛先をずっと触っています。', 1.0, 20),
  (3, '「今日は毛先を揃えるだけでいいです」と最初に言われました。', 1.0, 30),
  (4, '明らかに自分と髪質の違うモデルの写真を持ってきたお客様がいます。', 1.0, 40),
  (5, '「小顔に見えるようにしてほしい」と要望されました。', 1.0, 50),
  (6, '理想としているカラーに、今の髪のダメージ状態では一回で届きません。', 1.0, 60),
  (7, '要望を話す途中で、お客様が何度も言い直しています。', 1.0, 70),
  (8, '複数の選択肢の中から、今日の施術プランを一つ決める場面です。', 1.0, 80),
  (9, '仕上がりを自宅でどれだけ再現できるかを考える場面です。', 1.0, 90),
  (10, '「最近、役職が変わりました」とだけお客様が話しました。', 1.0, 100),
  (11, '「お任せします」とだけ言われました。', 1.0, 110),
  (12, '提案した内容に対して、お客様が良い反応も悪い反応も見せません。', 1.0, 120),
  (13, '「どう思いますか？」とお客様から直接意見を求められました。', 1.0, 130),
  (14, '新しい技術を習得したばかりの時期です。', 1.0, 140),
  (15, '「もう少し若く見えるようにしたい」と要望されました。', 1.0, 150),
  (16, '自宅でのケア方法について相談されました。', 1.0, 160),
  (17, '後輩スタッフから技術的な相談を受けました。', 1.0, 170),
  (18, '「半年かけてダメージを直したい」という中長期の要望をもらいました。', 1.0, 180),
  (19, '仕上げの段階で、お客様が鏡を何度も見返しています。', 1.0, 190),
  (20, 'あなたが美容師をしていて、一番嬉しいと感じる瞬間はどれに近いですか？', 1.0, 200),
  (21, '施術が終わった直後、あなたが一番気にすることはどれに近いですか？', 1.0, 210),
  (22, '次回お客様が来店した時、まず何を確認したいですか？', 1.0, 220),
  (23, '新しい技術やスタイルへの挑戦を、今ちょうど迷っています。', 1.0, 230),
  (24, '自分の強みを一つ伸ばすとしたら、どれを選びますか？', 0.5, 240),
  (25, 'これからどんな美容師になっていきたいですか？', 0.5, 250);

insert into public.strength_options (question_id, option_key, option_text)
select q.id, v.option_key, v.option_text
from (values
  (1, 'A', '空欄のまま、会話の中で情報を集めていく'),
  (1, 'B', '「書きにくいことがありましたか？」とまず聞く'),
  (1, 'C', '過去の来店データがないので、髪と頭皮の状態から仮説を立てる'),
  (1, 'D', 'なぜ空欄が多いのか、その人の状況を考えてみる'),
  (2, 'A', '毛先のダメージを確認する'),
  (2, 'B', '「今日ちょっと気になります？」と聞く'),
  (2, 'C', '前回何か不満が残ったのか考える'),
  (2, 'D', '次の施術でどう改善するか考える'),
  (3, 'A', '本当にそれだけでいいのか、他に気になる部分がないか観察する'),
  (3, 'B', '揃えるだけで満足してもらえるよう丁寧に仕上げる'),
  (3, 'C', 'なぜ「揃えるだけ」にしたのか、背景を想像する'),
  (3, 'D', '揃えた後の生活の中でどう見えるかまで考える'),
  (4, 'A', '写真のどの部分に惹かれているのか観察する'),
  (4, 'B', '髪質の違いを考慮して、実現可能な形に技術で調整する'),
  (4, 'C', '写真から伝わる雰囲気を汲み取り、別の形で表現する提案をする'),
  (4, 'D', 'どう伝えれば分かりやすいか、言葉を選ぶ'),
  (5, 'A', '顔の輪郭や骨格をよく観察する'),
  (5, 'B', '小顔に「見られたい」理由や場面を聞いてみる'),
  (5, 'C', '骨格・分け目・レイヤーなど複数要素を組み合わせて設計する'),
  (5, 'D', '仕上がりのイメージをお客様と一緒に言語化する'),
  (6, 'A', '今の髪の状態を細かく確認し、可能な範囲を見極める'),
  (6, 'B', '理想に届かないことをどう伝えれば落胆させないか考える'),
  (6, 'C', '段階的なプランを立て、今後の見通しを設計する'),
  (6, 'D', 'なぜその理想にこだわるのか、背景を探る'),
  (7, 'A', '言い直しのパターンから、本当に伝えたいことを探る'),
  (7, 'B', '急かさず、話しやすい空気をつくる'),
  (7, 'C', '言葉にならない部分を、選択肢を示して確認する'),
  (7, 'D', '迷いの背景にある生活や気持ちの変化を考える'),
  (8, 'A', 'これまでの観察から得た情報を整理して選ぶ'),
  (8, 'B', 'お客様の気持ちに一番寄り添える選択肢を選ぶ'),
  (8, 'C', '技術的に一番実現度が高い選択肢を選ぶ'),
  (8, 'D', '半年後を見据えて一番発展性のある選択肢を選ぶ'),
  (9, 'A', 'お客様の朝の時間や道具を具体的に聞く'),
  (9, 'B', '再現しやすいシンプルな技術を選ぶ'),
  (9, 'C', '再現できなかった時の気持ちを想像する'),
  (9, 'D', '再現方法を分かりやすい言葉と手順で伝える'),
  (10, 'A', '表情や話し方の変化に注目する'),
  (10, 'B', 'どんな一年になりそうか、想像して会話を広げる'),
  (10, 'C', '新しい役職での日常がどう変わるかを聞く'),
  (10, 'D', 'その言葉の裏にある気持ちを汲み取る'),
  (11, 'A', 'お任せの裏にある希望を想像する'),
  (11, 'B', 'プロとしての見立てを先に言葉で差し出す'),
  (11, 'C', 'これまでの来店履歴や髪の状態から判断する'),
  (11, 'D', '「お任せ」と言えるくらい信頼してもらえていることに応えようと考える'),
  (12, 'A', '表情や仕草の小さな変化を注意深く見る'),
  (12, 'B', '迷いの理由を直接聞いてみる'),
  (12, 'C', '別の角度からの提案を考える'),
  (12, 'D', '今日決めなくても良い選択肢を用意する'),
  (13, 'A', '観察した情報をもとに率直な見立てを伝える'),
  (13, 'B', 'お客様がどう見られたいかを踏まえて答える'),
  (13, 'C', '生活スタイルに合うかどうかの視点で答える'),
  (13, 'D', '今後の展望も含めて答える'),
  (14, 'A', 'どのお客様に向いているか、観察して見極める'),
  (14, 'B', '技術の完成度をまず高めることに集中する'),
  (14, 'C', 'お客様にどう説明すれば魅力が伝わるか考える'),
  (14, 'D', 'この技術が半年後にどう活きるか考える'),
  (15, 'A', '顔まわりや髪質から、若さの印象を左右する要素を観察する'),
  (15, 'B', '「若く見える」ことがなぜ大事なのか、背景を聞く'),
  (15, 'C', '骨格や雰囲気を踏まえて総合的にデザインする'),
  (15, 'D', '日常の中でその印象を保てる方法まで考える'),
  (16, 'A', '髪や頭皮の状態を細かく確認してから答える'),
  (16, 'B', '続けやすい方法かどうかを一番に考える'),
  (16, 'C', '分かりやすく、実践しやすい言葉で伝える'),
  (16, 'D', '相談してきた背景にある不安を汲み取る'),
  (17, 'A', '後輩がどこでつまずいているか観察してから答える'),
  (17, 'B', '一緒に考えながら、答えを急がず伴走する'),
  (17, 'C', '具体的な解決策を提示する'),
  (17, 'D', '分かりやすい言葉と手順で説明する'),
  (18, 'A', '現在の髪の状態を詳しく観察し、記録する'),
  (18, 'B', '半年間のステップと見通しを設計する'),
  (18, 'C', '実現可能な技術的な手段を組み立てる'),
  (18, 'D', '半年間、不安にならないよう伴走する姿勢を伝える'),
  (19, 'A', '鏡を見る回数やタイミングから気持ちを読み取る'),
  (19, 'B', '「気になるところはありますか？」と声をかける'),
  (19, 'C', '見ている箇所を特定し、必要なら微調整する'),
  (19, 'D', '今後のスタイリングに向けたアドバイスを添える'),
  (20, 'A', 'お客様の小さな変化に自分が気づけた瞬間'),
  (20, 'B', 'お客様が心を開いて話してくれた瞬間'),
  (20, 'C', '提案が的確に響いた瞬間'),
  (20, 'D', '次回来店した時、日常が良くなっていた瞬間'),
  (21, 'A', '見た目の完成度に違和感がないか'),
  (21, 'B', 'お客様が満足そうな表情をしているか'),
  (21, 'C', '仕上がりが本人の希望とズレていないか'),
  (21, 'D', 'この後の生活で困らないか'),
  (22, 'A', '髪や頭皮の状態がどう変化したか'),
  (22, 'B', '自宅でのケアがどれくらい続けられたか'),
  (22, 'C', '前回の提案についてどう感じていたか'),
  (22, 'D', '日常生活にどんな変化があったか'),
  (23, 'A', 'まず情報を集めて、慎重に見極める'),
  (23, 'B', '誰かに相談し、後押ししてもらう'),
  (23, 'C', '挑戦した先にどんな景色があるか想像する'),
  (23, 'D', '今の延長線上ではなく、大胆に踏み出してみる'),
  (24, 'A', '人よりも観察力があると思う'),
  (24, 'B', '人よりも人の気持ちに寄り添えると思う'),
  (24, 'C', '人よりも本質を見抜く力があると思う'),
  (24, 'D', '人よりも粘り強く伴走できると思う'),
  (25, 'A', '誰も気づかない変化に気づける美容師'),
  (25, 'B', 'お客様の日常を一緒にデザインできる美容師'),
  (25, 'C', '頼れる伴走者でありたい'),
  (25, 'D', '安心して本音を話してもらえる美容師でありたい')
) as v(number, option_key, option_text)
join public.strength_questions q on q.number = v.number;

insert into public.strength_option_scores (option_id, strength_type_key, score)
select o.id, v.strength_type_key, v.score
from (values
  (1, 'A', 'observer', 2), (1, 'A', 'empathizer', 1), (1, 'B', 'empathizer', 2), (1, 'B', 'connector', 1),
  (1, 'C', 'solver', 2), (1, 'C', 'observer', 1), (1, 'D', 'insighter', 2),
  (2, 'A', 'observer', 2), (2, 'A', 'solver', 1), (2, 'B', 'empathizer', 1), (2, 'B', 'connector', 2),
  (2, 'C', 'insighter', 2), (2, 'D', 'solver', 2),
  (3, 'A', 'observer', 2), (3, 'A', 'insighter', 1), (3, 'B', 'solver', 2), (3, 'C', 'insighter', 2),
  (3, 'C', 'empathizer', 1), (3, 'D', 'life_designer', 2),
  (4, 'A', 'observer', 2), (4, 'A', 'designer', 1), (4, 'B', 'solver', 2), (4, 'C', 'designer', 2),
  (4, 'C', 'insighter', 1), (4, 'D', 'connector', 2),
  (5, 'A', 'observer', 2), (5, 'B', 'insighter', 2), (5, 'B', 'empathizer', 1), (5, 'C', 'designer', 2),
  (5, 'C', 'solver', 1), (5, 'D', 'connector', 2),
  (6, 'A', 'observer', 1), (6, 'A', 'solver', 2), (6, 'B', 'empathizer', 2), (6, 'B', 'connector', 1),
  (6, 'C', 'life_designer', 2), (6, 'C', 'developer', 1), (6, 'D', 'insighter', 2),
  (7, 'A', 'insighter', 2), (7, 'B', 'empathizer', 2), (7, 'C', 'connector', 2), (7, 'C', 'observer', 1),
  (7, 'D', 'life_designer', 1), (7, 'D', 'insighter', 1),
  (8, 'A', 'observer', 2), (8, 'B', 'empathizer', 2), (8, 'C', 'solver', 2), (8, 'D', 'developer', 2),
  (8, 'D', 'life_designer', 1),
  (9, 'A', 'life_designer', 2), (9, 'B', 'solver', 2), (9, 'C', 'empathizer', 1), (9, 'C', 'insighter', 1),
  (9, 'D', 'connector', 2),
  (10, 'A', 'observer', 2), (10, 'B', 'developer', 2), (10, 'B', 'life_designer', 1), (10, 'C', 'life_designer', 2),
  (10, 'D', 'empathizer', 2), (10, 'D', 'insighter', 1),
  (11, 'A', 'insighter', 2), (11, 'B', 'connector', 2), (11, 'B', 'designer', 1), (11, 'C', 'observer', 2),
  (11, 'C', 'solver', 1), (11, 'D', 'empathizer', 2),
  (12, 'A', 'observer', 2), (12, 'B', 'connector', 2), (12, 'C', 'designer', 2), (12, 'C', 'solver', 1),
  (12, 'D', 'empathizer', 1), (12, 'D', 'life_designer', 1),
  (13, 'A', 'observer', 1), (13, 'A', 'connector', 2), (13, 'B', 'designer', 2), (13, 'B', 'insighter', 1),
  (13, 'C', 'life_designer', 2), (13, 'D', 'developer', 2),
  (14, 'A', 'observer', 2), (14, 'B', 'solver', 2), (14, 'C', 'connector', 2), (14, 'C', 'designer', 1),
  (14, 'D', 'developer', 1), (14, 'D', 'life_designer', 1),
  (15, 'A', 'observer', 2), (15, 'B', 'insighter', 2), (15, 'B', 'empathizer', 1), (15, 'C', 'designer', 2),
  (15, 'D', 'life_designer', 2),
  (16, 'A', 'observer', 1), (16, 'A', 'solver', 1), (16, 'B', 'life_designer', 2), (16, 'C', 'connector', 2),
  (16, 'D', 'empathizer', 2),
  (17, 'A', 'observer', 2), (17, 'B', 'developer', 2), (17, 'C', 'solver', 2), (17, 'D', 'connector', 2),
  (18, 'A', 'observer', 2), (18, 'B', 'developer', 2), (18, 'B', 'life_designer', 1), (18, 'C', 'solver', 2),
  (18, 'D', 'empathizer', 2), (18, 'D', 'developer', 1),
  (19, 'A', 'observer', 2), (19, 'A', 'insighter', 1), (19, 'B', 'connector', 2), (19, 'B', 'empathizer', 1),
  (19, 'C', 'solver', 2), (19, 'D', 'life_designer', 2),
  (20, 'A', 'observer', 2), (20, 'B', 'empathizer', 2), (20, 'C', 'insighter', 1), (20, 'C', 'designer', 1),
  (20, 'D', 'developer', 2), (20, 'D', 'life_designer', 1),
  (21, 'A', 'solver', 2), (21, 'B', 'empathizer', 2), (21, 'C', 'insighter', 1), (21, 'C', 'designer', 1),
  (21, 'D', 'life_designer', 2),
  (22, 'A', 'observer', 2), (22, 'B', 'life_designer', 2), (22, 'B', 'solver', 1), (22, 'C', 'connector', 2),
  (22, 'C', 'empathizer', 1), (22, 'D', 'developer', 2),
  (23, 'A', 'observer', 1), (23, 'A', 'solver', 1), (23, 'B', 'empathizer', 1), (23, 'B', 'connector', 1),
  (23, 'C', 'developer', 2), (23, 'D', 'designer', 2),
  (24, 'A', 'observer', 2), (24, 'B', 'empathizer', 2), (24, 'C', 'insighter', 2), (24, 'D', 'developer', 2),
  (25, 'A', 'observer', 2), (25, 'B', 'life_designer', 2), (25, 'B', 'designer', 1), (25, 'C', 'developer', 2),
  (25, 'D', 'empathizer', 2), (25, 'D', 'connector', 1)
) as v(number, option_key, strength_type_key, score)
join public.strength_questions q on q.number = v.number
join public.strength_options o on o.question_id = q.id and o.option_key = v.option_key;

-- ---------------------------------------------------------------------------
-- strength_assessments / strength_assessment_answers / strength_results
-- ---------------------------------------------------------------------------
create table public.strength_assessments (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.profiles (id),
  status text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create index strength_assessments_staff_id_idx on public.strength_assessments (staff_id);

alter table public.strength_assessments enable row level security;

create policy strength_assessments_select on public.strength_assessments
  for select using (staff_id = auth.uid() or public.is_admin(auth.uid()));

create policy strength_assessments_insert on public.strength_assessments
  for insert with check (staff_id = auth.uid());

create policy strength_assessments_update on public.strength_assessments
  for update using (staff_id = auth.uid());

create table public.strength_assessment_answers (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.strength_assessments (id),
  question_id uuid not null references public.strength_questions (id),
  option_id uuid not null references public.strength_options (id),
  answered_at timestamptz not null default now(),
  unique (assessment_id, question_id)
);

create index strength_assessment_answers_assessment_idx on public.strength_assessment_answers (assessment_id);

alter table public.strength_assessment_answers enable row level security;

create policy strength_assessment_answers_select on public.strength_assessment_answers
  for select using (
    exists (
      select 1 from public.strength_assessments a
      where a.id = strength_assessment_answers.assessment_id and a.staff_id = auth.uid()
    )
  );

create policy strength_assessment_answers_insert on public.strength_assessment_answers
  for insert with check (
    exists (
      select 1 from public.strength_assessments a
      where a.id = assessment_id and a.staff_id = auth.uid()
    )
  );

create policy strength_assessment_answers_update on public.strength_assessment_answers
  for update using (
    exists (
      select 1 from public.strength_assessments a
      where a.id = strength_assessment_answers.assessment_id and a.staff_id = auth.uid()
    )
  );

create table public.strength_results (
  assessment_id uuid primary key references public.strength_assessments (id),
  scores jsonb not null,
  core_type_key text not null references public.strength_types (key),
  support_type_key text not null references public.strength_types (key),
  emerging_type_key text not null references public.strength_types (key),
  is_dual_type boolean not null default false,
  dual_partner_type_key text references public.strength_types (key),
  combination_type_id uuid references public.strength_combination_types (id),
  computed_at timestamptz not null default now()
);

alter table public.strength_results enable row level security;

create policy strength_results_select on public.strength_results
  for select using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from public.strength_assessments a
      where a.id = strength_results.assessment_id and a.staff_id = auth.uid()
    )
  );

-- Same-user write, no privilege boundary crossed — RLS check (not an RPC)
-- mirrors the cases/case_reviews insert pattern. The scoring math itself
-- runs in a "use server" / client action, not in SQL.
create policy strength_results_insert on public.strength_results
  for insert with check (
    exists (
      select 1 from public.strength_assessments a
      where a.id = assessment_id and a.staff_id = auth.uid() and a.status = 'completed'
    )
  );

-- ---------------------------------------------------------------------------
-- tacit_profiles — denormalized read model (ME page, future TEAM TACIT)
-- ---------------------------------------------------------------------------
create table public.tacit_profiles (
  staff_id uuid primary key references public.profiles (id),
  latest_assessment_id uuid references public.strength_assessments (id),
  core_type_key text references public.strength_types (key),
  support_type_key text references public.strength_types (key),
  emerging_type_key text references public.strength_types (key),
  is_dual_type boolean not null default false,
  combination_type_id uuid references public.strength_combination_types (id),
  updated_at timestamptz not null default now()
);

alter table public.tacit_profiles enable row level security;

-- Read-only peer visibility (type names only, no scores) — no ranking data
-- is ever exposed here, and it is what future TEAM TACIT will read from.
create policy tacit_profiles_select on public.tacit_profiles
  for select using (auth.role() = 'authenticated');

create policy tacit_profiles_insert on public.tacit_profiles
  for insert with check (staff_id = auth.uid());

create policy tacit_profiles_update on public.tacit_profiles
  for update using (staff_id = auth.uid());
