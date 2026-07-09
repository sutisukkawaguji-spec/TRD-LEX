const isProd = process.env.NODE_ENV === 'production';
export const basePath = isProd ? '/TRD-LEX' : '';

export function getAssetUrl(path) {
  if (!path) return '';
  if (
    path.startsWith('http') || 
    path.startsWith('data:') || 
    path.startsWith('blob:') ||
    path.startsWith('mailto:') ||
    path.startsWith('tel:')
  ) {
    return path;
  }
  
  // Ensure we don't have double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
}
