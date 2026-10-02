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
      .select('id, title, body, image_url, published_at, created_at')
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
    <aside className="note" aria-label="Latest blog note">
      <div className="note__head">
        <span>Latest note</span>
        <button className="link" type="button" onClick={onOpenBlog} style={{ border: 0, padding: 0, background: 'none', color: 'var(--ink)', font: 'inherit', cursor: 'pointer', minHeight: 44 }}>
          Read the blog <span aria-hidden="true">→</span>
        </button>
      </div>
      <div className="note__body note__item" key={post.id}>
        <div>
          <time className="mono" style={{ color: 'var(--ink-3)' }}>{formatDate(post.published_at)}</time>
          <h3 className="note__title">{post.title}</h3>
          <p className="note__excerpt">{getExcerpt(post.body)}</p>
        </div>
        <img className="note__img" src={getBlogLandscape(post.image_url, activeIndex)} alt="" aria-hidden="true" loading="lazy" />
      </div>
      {posts.length > 1 && <div className="note__dots" aria-hidden="true">{posts.map((item, index) => <span className={index === activeIndex ? 'is-active' : ''} key={item.id} />)}</div>}
    </aside>
  );
}
