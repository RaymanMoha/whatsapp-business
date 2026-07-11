export function ThemeScript() {
  const code = `
  try {
    // Always default to light mode unless explicitly set to dark
    var t = localStorage.getItem('disruptor.theme');
    
    // If no theme is set, force light mode
    if (!t || t === 'light') {
      localStorage.setItem('disruptor.theme', 'light');
      document.documentElement.classList.remove('dark');
    } else if (t === 'dark') {
      // Only use dark if explicitly set
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    // Fallback to light mode on error
    document.documentElement.classList.remove('dark');
  }
  `
  return <script dangerouslySetInnerHTML={{ __html: code }} />
}

