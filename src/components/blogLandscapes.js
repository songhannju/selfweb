export const blogLandscapes = [
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=82',
];

export function getBlogLandscape(imageUrl, index) {
  return imageUrl || blogLandscapes[index % blogLandscapes.length];
}
