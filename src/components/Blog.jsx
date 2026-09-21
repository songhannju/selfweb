import { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import { supabase, supabaseConfigError } from '../lib/supabase';

const emptyDraft = { title: '', body: '', date: new Date().toISOString().slice(0, 10) };
const emojis = ['😀', '😂', '😍', '🤔', '😅', '🎉', '🚀', '✨', '💡', '🔥', '🛠️', '☕', '❤️', '👍', '🙌', '🌱'];

function formatDate(date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`));
}

export default function Blog({ onBack }) {
  const [posts, setPosts] = useState([]);
  const [draft, setDraft] = useState(emptyDraft);
  const [isWriting, setIsWriting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const editorRef = useRef(null);

  useEffect(() => {
    if (!supabase) {
      setErrorMessage(supabaseConfigError);
      setIsLoading(false);
      return undefined;
    }

    async function loadPosts() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, body, image_url, published_at, created_at')
        .order('created_at', { ascending: false });

      if (error) setErrorMessage(error.message);
      else setPosts(data ?? []);
      setIsLoading(false);
    }

    loadPosts();
  }, []);

  function updateDraft(event) {
    setDraft((currentDraft) => ({ ...currentDraft, [event.target.name]: event.target.value }));
  }

  function runEditorCommand(command, value = null) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    setDraft((currentDraft) => ({ ...currentDraft, body: editorRef.current?.innerHTML ?? '' }));
  }

  function addEmoji(emoji) {
    runEditorCommand('insertText', emoji);
  }

  function addLink() {
    const url = window.prompt('Enter the link URL');
    if (url?.trim()) runEditorCommand('createLink', url.trim());
  }

  function addCodeBlock() {
    const code = window.prompt('Paste your code snippet');
    if (code?.trim()) runEditorCommand('insertHTML', `<pre><code>${DOMPurify.sanitize(code.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })}</code></pre>`);
  }

  function pasteFormattedContent(event) {
    const html = event.clipboardData.getData('text/html');
    if (!html) return;

    event.preventDefault();
    const cleanHtml = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['br', 'div', 'h1', 'h2', 'h3', 'p', 'span', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'a', 'pre', 'code'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'style'],
    });
    runEditorCommand('insertHTML', cleanHtml);
  }

  function chooseImage(event) {
    const [file] = event.target.files;
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      setErrorMessage('Please choose an image smaller than 5 MB.');
      event.target.value = '';
      return;
    }

    setErrorMessage('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function publishPost(event) {
    event.preventDefault();
    if (!draft.title.trim() || !draft.body.trim()) return;
    if (!supabase) {
      setErrorMessage(supabaseConfigError);
      return;
    }
    setIsSaving(true);
    setErrorMessage('');

    const safeBody = DOMPurify.sanitize(draft.body.trim());
    let imageUrl = null;
    let uploadedPath = null;

    if (imageFile) {
      const safeFileName = imageFile.name.replace(/[^a-z0-9.-]/gi, '-');
      uploadedPath = `${crypto.randomUUID()}-${safeFileName}`;
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(uploadedPath, imageFile, { contentType: imageFile.type, upsert: false });

      if (uploadError) {
        setErrorMessage(uploadError.message);
        setIsSaving(false);
        return;
      }
      imageUrl = supabase.storage.from('blog-images').getPublicUrl(uploadedPath).data.publicUrl;
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({ title: draft.title.trim(), body: safeBody, image_url: imageUrl, published_at: draft.date })
      .select('id, title, body, image_url, published_at, created_at')
      .single();

    if (error) {
      if (uploadedPath) await supabase.storage.from('blog-images').remove([uploadedPath]);
      setErrorMessage(error.message);
    }
    else {
      setPosts((currentPosts) => [data, ...currentPosts]);
      setDraft({ ...emptyDraft, date: new Date().toISOString().slice(0, 10) });
      setImageFile(null);
      setImagePreview('');
      setIsWriting(false);
    }
    setIsSaving(false);
  }

  async function deletePost(id) {
    setErrorMessage('');
    if (!supabase) {
      setErrorMessage(supabaseConfigError);
      return;
    }
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) setErrorMessage(error.message);
    else setPosts((currentPosts) => currentPosts.filter((post) => post.id !== id));
  }

  return (
    <main className="min-h-[calc(100svh-72px)] border-t border-white/[0.07]">
      <div className="mx-auto w-[min(1080px,calc(100%-48px))] py-16 md:py-24">
        <div className="flex flex-col gap-8 border-b border-white/[0.08] pb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#e8b66b]">Field Notes · Blog</p>
            <h1 className="font-serif text-5xl leading-none tracking-[-0.06em] text-[#e8ece8] md:text-7xl">Thinking in public.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#9aa59d]">Small observations from building systems, learning tools, and staying curious about technology.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-[#dfe7e1] transition hover:-translate-y-0.5 hover:bg-white/[0.12]" type="button" onClick={onBack}>Back to resume</button>
            <button className="rounded-full bg-[#e8b66b] px-4 py-2.5 text-sm font-semibold text-[#17130d] shadow-[0_14px_30px_rgba(232,182,107,0.18)] transition hover:-translate-y-0.5" type="button" onClick={() => setIsWriting((current) => !current)}>{isWriting ? 'Close editor' : 'Write a note'}</button>
          </div>
        </div>

        {errorMessage && <p className="mt-6 rounded-xl border border-[#d98f8f]/30 bg-[#d98f8f]/10 px-4 py-3 text-sm leading-6 text-[#f0b1b1]">Could not connect to the blog database: {errorMessage}</p>}

        {isWriting && (
          <form className="mt-10 rounded-3xl border border-[#e8b66b]/25 bg-[#211d16]/70 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.2)] md:p-7" onSubmit={publishPost}>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e8b66b]">New entry</p>
                <h2 className="mt-2 font-serif text-3xl tracking-[-0.04em]">What are you thinking about today?</h2>
              </div>
              <span className="hidden text-2xl md:block" aria-hidden="true">✦</span>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_180px]">
              <label className="text-sm text-[#9aa59d]">Title<input className="mt-2 w-full rounded-xl border border-white/10 bg-[#111613] px-4 py-3 text-base text-[#e8ece8] outline-none transition placeholder:text-[#68736c] focus:border-[#e8b66b]/70" name="title" value={draft.title} onChange={updateDraft} placeholder="A small lesson about..." required /></label>
              <label className="text-sm text-[#9aa59d]">Date<input className="mt-2 w-full rounded-xl border border-white/10 bg-[#111613] px-4 py-3 text-base text-[#e8ece8] outline-none transition focus:border-[#e8b66b]/70" type="date" name="date" value={draft.date} onChange={updateDraft} required /></label>
            </div>
            <label className="mt-4 block text-sm text-[#9aa59d]">Image<span className="mt-2 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-dashed border-white/15 bg-[#111613] px-4 py-3 text-[#b5c0b8] transition hover:border-[#e8b66b]/60"><span>{imageFile ? imageFile.name : 'Optional image, up to 5 MB'}</span><span className="rounded-full bg-white/[0.08] px-3 py-1.5 text-xs text-[#e8b66b]">Browse</span><input className="sr-only" type="file" accept="image/*" onChange={chooseImage} /></span></label>
            {imagePreview && <img className="mt-4 max-h-72 w-full rounded-2xl border border-white/10 object-cover" src={imagePreview} alt="Selected blog preview" />}
            <div className="mt-4 rounded-xl border border-white/10 bg-[#111613] p-2" role="toolbar" aria-label="Blog formatting tools">
              <div className="flex flex-wrap items-center gap-1">
                {emojis.map((emoji) => <button className="grid size-8 place-items-center rounded-lg text-base transition hover:bg-white/10" type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => addEmoji(emoji)} key={emoji} aria-label={`Insert ${emoji}`}>{emoji}</button>)}
                <span className="mx-1 h-6 w-px bg-white/10" />
                <button className="rounded-lg px-2.5 py-1.5 text-sm font-bold transition hover:bg-white/10" type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => runEditorCommand('bold')} aria-label="Bold">B</button>
                <button className="rounded-lg px-2.5 py-1.5 text-sm italic transition hover:bg-white/10" type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => runEditorCommand('italic')} aria-label="Italic">I</button>
                <button className="rounded-lg px-2.5 py-1.5 text-sm underline transition hover:bg-white/10" type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => runEditorCommand('underline')} aria-label="Underline">U</button>
                <select className="rounded-lg border-0 bg-transparent px-2 py-1.5 text-xs text-[#b5c0b8] outline-none" defaultValue="p" onChange={(event) => runEditorCommand('formatBlock', event.target.value)} aria-label="Text format"><option value="p">Paragraph</option><option value="h2">Heading</option><option value="h3">Subheading</option></select>
                <select className="rounded-lg border-0 bg-transparent px-2 py-1.5 text-xs text-[#b5c0b8] outline-none" defaultValue="3" onChange={(event) => runEditorCommand('fontSize', event.target.value)} aria-label="Font size"><option value="2">Small</option><option value="3">Normal</option><option value="5">Large</option><option value="7">Huge</option></select>
                <button className="rounded-lg px-2.5 py-1.5 text-sm transition hover:bg-white/10" type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => runEditorCommand('insertUnorderedList')} aria-label="Bullet list">• List</button>
                <button className="rounded-lg px-2.5 py-1.5 text-sm transition hover:bg-white/10" type="button" onMouseDown={(event) => event.preventDefault()} onClick={addLink} aria-label="Insert hyperlink">Link</button>
                <button className="rounded-lg px-2.5 py-1.5 text-sm transition hover:bg-white/10" type="button" onMouseDown={(event) => event.preventDefault()} onClick={addCodeBlock} aria-label="Insert code block">Code</button>
              </div>
            </div>
            <div className="mt-2 min-h-64 w-full rounded-xl border border-white/10 bg-[#111613] px-4 py-3 text-sm leading-7 text-[#e8ece8] outline-none transition focus:border-[#e8b66b]/70 empty:before:pointer-events-none empty:before:text-[#68736c] empty:before:content-[attr(data-placeholder)]" contentEditable ref={editorRef} role="textbox" aria-multiline="true" data-placeholder="Write your note here. Select text to format it, use the emoji buttons above, or insert a link." onPaste={pasteFormattedContent} onInput={(event) => { const body = event.currentTarget.innerHTML; setDraft((currentDraft) => ({ ...currentDraft, body })); }} />
            <div className="mt-5 flex items-center justify-between gap-4"><p className="text-xs leading-5 text-[#718078]">Choose an emoji above, select text for formatting, or use Link to add a hyperlink. Code opens a snippet prompt.</p><button className="shrink-0 rounded-full bg-[#8fc2af] px-5 py-3 text-sm font-bold text-[#07100c] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60" type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Publish note'}</button></div>
          </form>
        )}

        <div className="mt-12 space-y-6">
          {isLoading ? <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-16 text-center text-sm text-[#8d9890]">Loading notes...</div> : posts.length === 0 ? <div className="rounded-3xl border border-dashed border-white/15 px-6 py-16 text-center"><p className="text-3xl" aria-hidden="true">📝</p><h2 className="mt-4 font-serif text-3xl tracking-[-0.04em]">Your first note is waiting.</h2><p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#8d9890]">Write down the question you are carrying, the bug you finally understood, or the idea you want to return to.</p></div> : posts.map((post) => <article className="group rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-sm transition hover:border-[#e8b66b]/30 hover:bg-white/[0.065] md:p-8" key={post.id}><div className="flex items-start justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#e8b66b]">{formatDate(post.published_at)}</p><h2 className="mt-3 font-serif text-3xl tracking-[-0.04em] text-[#e8ece8] md:text-4xl">{post.title}</h2></div><button className="text-xs text-[#68736c] opacity-0 transition hover:text-[#d98f8f] group-hover:opacity-100" type="button" onClick={() => deletePost(post.id)} aria-label={`Delete ${post.title}`}>Delete</button></div><div className="mt-7"><PostBody body={post.body} /></div></article>)}
        </div>
        {!isLoading && <BlogContributions posts={posts} />}
      </div>
    </main>
  );
}

function BlogContributions({ posts }) {
  const today = new Date();
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 364);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const days = [];
  const counts = new Map();
  posts.forEach((post) => {
    const key = post.published_at;
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const key = date.toISOString().slice(0, 10);
    days.push({ key, count: counts.get(key) || 0, date: new Date(date) });
  }

  const activeDays = days.filter((day) => day.count > 0).length;
  const recentPosts = [...posts].sort((first, second) => new Date(second.published_at) - new Date(first.published_at)).slice(0, 3);
  const monthSummary = [...posts.reduce((summary, post) => {
    const month = new Date(`${post.published_at}T12:00:00`).toLocaleDateString('en', { month: 'short', year: 'numeric' });
    summary.set(month, (summary.get(month) || 0) + 1);
    return summary;
  }, new Map())].slice(0, 4);
  const monthLabels = days.reduce((labels, day, index) => {
    const weekIndex = Math.floor(index / 7);
    const isFirstDisplayedWeek = index === 0;
    const isMonthStart = day.date.getDate() === 1;
    if ((isFirstDisplayedWeek || isMonthStart) && labels[labels.length - 1]?.index !== weekIndex) {
      labels.push({ label: day.date.toLocaleDateString('en', { month: 'short' }), index: weekIndex });
    }
    return labels;
  }, []);

  return <section className="blog-contributions mt-16 border-t border-white/[0.08] pt-10" aria-labelledby="blog-contributions-title">
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8fc2af]">Writing activity</p><h2 id="blog-contributions-title" className="mt-2 font-serif text-3xl tracking-[-0.04em]">A visual record of your practice.</h2></div>
      <p className="max-w-sm text-sm leading-6 text-[#8d9890]">Each bright mark is a day you put an idea into the world.</p>
    </div>
    <div className="mt-7 grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
        <div className="writing-stat"><strong>{posts.length}</strong><span>total notes</span></div>
        <div className="writing-stat"><strong>{activeDays}</strong><span>active days</span></div>
        {monthSummary.slice(0, 2).map(([month, count]) => <div className="writing-stat" key={month}><strong>{count}</strong><span>{month}</span></div>)}
      </div>
      <div className="overflow-hidden">
      <div className="blog-contribution-months" aria-hidden="true">{monthLabels.map((month) => <span key={`${month.label}-${month.index}`}>{month.label}</span>)}</div>
      <div className="blog-contribution-grid" aria-label="Blog publishing activity for the last year">{Array.from({ length: 53 }, (_, weekIndex) => <div className="blog-contribution-week" key={weekIndex}>{Array.from({ length: 7 }, (_, dayIndex) => { const day = days[weekIndex * 7 + dayIndex]; return day ? <span className={`blog-contribution-cell ${day.count > 0 ? 'has-entry' : ''}`} title={`${day.count} ${day.count === 1 ? 'entry' : 'entries'} on ${formatDate(day.key)}`} key={day.key} /> : <span className="blog-contribution-cell" aria-hidden="true" key={`${weekIndex}-${dayIndex}`} />; })}</div>)}</div>
      <div className="mt-3 flex items-center justify-end gap-2 text-xs text-[#718078]"><span className="blog-contribution-cell blog-contribution-legend-cell has-entry" /><span>Blog published</span></div>
      </div>
    </div>
    {recentPosts.length > 0 && <div className="mt-8"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8d9890]">Latest notes</p><div className="mt-3 grid gap-2 md:grid-cols-3">{recentPosts.map((post) => <div className="writing-activity-item" key={post.id}><span className="writing-activity-dot" /><div><span className="block truncate text-sm text-[#c2cbc4]">{post.title}</span><time className="mt-1 block text-xs text-[#8d9890]">{formatDate(post.published_at)}</time></div></div>)}</div></div>}
  </section>;
}

function PostBody({ body }) {
  if (body.trim().startsWith('<')) {
    return <div className="rich-post-body space-y-4 text-[0.98rem] leading-8 text-[#b5c0b8]" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body) }} />;
  }

  const lines = body.split('\n');
  const blocks = [];
  let currentCode = null;

  lines.forEach((line) => {
    if (line.startsWith('```')) {
      if (currentCode) {
        blocks.push({ type: 'code', language: currentCode.language, content: currentCode.lines.join('\n') });
        currentCode = null;
      } else {
        currentCode = { language: line.slice(3).trim() || 'text', lines: [] };
      }
    } else if (currentCode) {
      currentCode.lines.push(line);
    } else if (line.trim() === '') {
      blocks.push({ type: 'space' });
    } else if (line.startsWith('## ')) {
      blocks.push({ type: 'heading', content: line.slice(3) });
    } else if (line.startsWith('- ')) {
      blocks.push({ type: 'bullet', content: line.slice(2) });
    } else {
      blocks.push({ type: 'paragraph', content: line });
    }
  });

  if (currentCode) blocks.push({ type: 'code', language: currentCode.language, content: currentCode.lines.join('\n') });

  return <div className="space-y-4 text-[0.98rem] leading-8 text-[#b5c0b8]">{blocks.map((block, index) => {
    if (block.type === 'space') return <div className="h-1" key={`${block.type}-${index}`} />;
    if (block.type === 'heading') return <h3 className="font-serif text-2xl text-[#e8ece8]" key={`${block.type}-${index}`}>{block.content}</h3>;
    if (block.type === 'bullet') return <p className="pl-5 before:mr-3 before:text-[#e8b66b] before:content-['•']" key={`${block.type}-${index}`}>{block.content}</p>;
    if (block.type === 'code') return <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0a0d0b]" key={`${block.type}-${index}`}><div className="border-b border-white/[0.07] px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[#8d9890]">{block.language}</div><pre className="p-4 text-sm leading-7 text-[#d6e5da]"><code>{block.content}</code></pre></div>;
    return <p key={`${block.type}-${index}`}>{block.content}</p>;
  })}</div>;
}
