import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { supabase } from '../lib/supabase';
import { getBlogLandscape } from './blogLandscapes';

function formatDate(date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`));
}

function getExcerpt(body) {
  const plainText = DOMPurify.sanitize(body, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).replace(/\s+/g, ' ').trim();
  return plainText.length > 180 ? `${plainText.slice(0, 180).trim()}...` : plainText;
}

export default function BlogTicker({ onOpenBlog }) {
  const [posts, setPosts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!supabase) return undefined;

    let isMounted = true;
    supabase
      .from('blog_posts')
      .select('id, title, body, published_at, created_at')
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => {
        if (isMounted) setPosts(data ?? []);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (posts.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % posts.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [posts.length]);

  if (!posts.length) return null;

  const post = posts[activeIndex];

  return (
    <aside className="blog-ticker mt-12 w-full overflow-hidden rounded-3xl border border-[#8fc2af]/20 bg-[linear-gradient(120deg,rgba(20,31,26,0.9),rgba(16,23,20,0.84))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.24)] md:p-8" aria-label="Latest blog notes">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#8fc2af]">Latest thinking</p>
        <button className="text-xs font-semibold uppercase tracking-[0.12em] text-[#b5c0b8] transition hover:text-[#8fc2af]" type="button" onClick={onOpenBlog}>Read all</button>
      </div>
      <div className="blog-ticker-item mt-4 grid gap-5 md:grid-cols-[1fr_220px] md:items-center" key={post.id}>
        <div>
          <p className="text-xs text-[#8d9890]">{formatDate(post.published_at)}</p>
          <h3 className="mt-2 font-serif text-2xl tracking-[-0.04em] text-[#e8ece8]">{post.title}</h3>
          <p className="mt-2 text-sm leading-7 text-[#9aa59d]">{getExcerpt(post.body)}</p>
        </div>
        <img className="h-28 w-full rounded-xl border border-white/15 object-cover opacity-90 shadow-[0_12px_28px_rgba(0,0,0,0.2)] saturate-[0.72]" src={getBlogLandscape(post.image_url, activeIndex)} alt="" aria-hidden="true" />
      </div>
      {posts.length > 1 && <div className="mt-5 flex gap-1.5" aria-hidden="true">{posts.map((item, index) => <span className={`h-1 rounded-full transition-all duration-500 ${index === activeIndex ? 'w-7 bg-[#8fc2af]' : 'w-2 bg-white/15'}`} key={item.id} />)}</div>}
    </aside>
  );
}
