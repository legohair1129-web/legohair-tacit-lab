-- Completes the MASTER KNOWLEDGE learning loop:
--   BEFORE VIEW  = master_knowledge_responses.response_text (existing)
--   MASTER'S VIEW = master_knowledge.master_view (existing)
--   AFTER VIEW   = master_knowledge_responses.reflection_text (new)
--
-- Reuses the existing master_knowledge_responses row (one per staff per
-- article) instead of adding a new table, per instruction to avoid
-- multiplying tables. No RLS change needed: the existing
-- master_knowledge_responses_update policy (`staff_id = auth.uid()`)
-- already covers writing the new columns on the caller's own row.
--
-- Also adds a per-article answer_placeholder so the free-text prompt
-- matches each article's actual question (observation / judgment /
-- proposal / life-design), instead of one generic placeholder for all 20.
--
-- Additive only: no column dropped/renamed/retyped, no row deleted.

alter table public.master_knowledge_responses
  add column reflection_text text,
  add column reflection_at timestamptz;

alter table public.master_knowledge
  add column answer_placeholder text;

update public.master_knowledge set answer_placeholder = 'あなたなら、何を見ますか？' where number = 1;
update public.master_knowledge set answer_placeholder = 'あなたなら、どう考えますか？' where number = 2;
update public.master_knowledge set answer_placeholder = 'あなたなら、何を見ますか？' where number = 3;
update public.master_knowledge set answer_placeholder = 'あなたなら、どう伝えますか？' where number = 4;
update public.master_knowledge set answer_placeholder = 'あなたなら、どう考えますか？' where number = 5;
update public.master_knowledge set answer_placeholder = 'あなたなら、どう伝えますか？' where number = 6;
update public.master_knowledge set answer_placeholder = 'あなたなら、どう伝えますか？' where number = 7;
update public.master_knowledge set answer_placeholder = 'あなたなら、何を見ますか？' where number = 8;
update public.master_knowledge set answer_placeholder = 'あなたなら、どう考えますか？' where number = 9;
update public.master_knowledge set answer_placeholder = 'あなたなら、何を見ますか？' where number = 10;
update public.master_knowledge set answer_placeholder = 'あなたなら、どう伝えますか？' where number = 11;
update public.master_knowledge set answer_placeholder = 'あなたなら、どう考えますか？' where number = 12;
update public.master_knowledge set answer_placeholder = 'あなたなら、どう伝えますか？' where number = 13;
update public.master_knowledge set answer_placeholder = 'あなたなら、どう伝えますか？' where number = 14;
update public.master_knowledge set answer_placeholder = 'あなたなら、どう伝えますか？' where number = 15;
update public.master_knowledge set answer_placeholder = 'あなたなら、どう考えますか？' where number = 16;
update public.master_knowledge set answer_placeholder = 'あなたなら、何を知ろうとしますか？' where number = 17;
update public.master_knowledge set answer_placeholder = 'あなたなら、何を知ろうとしますか？' where number = 18;
update public.master_knowledge set answer_placeholder = 'あなたなら、どう考えますか？' where number = 19;
update public.master_knowledge set answer_placeholder = 'あなたなら、どう考えますか？' where number = 20;
