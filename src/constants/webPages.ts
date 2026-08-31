export interface WebPageContent {
  url: string;
  domain: string;
  title: string;
  favicon: string;
  isSearchEngine?: boolean;
  type: 'google' | 'github' | 'youtube' | 'wikipedia' | 'hackernews' | 'news' | 'generic';
  data?: any;
}

export const KNOWN_PAGES: Record<string, WebPageContent> = {
  'google.com': {
    url: 'https://www.google.com',
    domain: 'google.com',
    title: 'Google',
    favicon: 'https://www.google.com/favicon.ico',
    isSearchEngine: true,
    type: 'google',
  },
  'github.com': {
    url: 'https://github.com',
    domain: 'github.com',
    title: 'GitHub: Let’s build from here',
    favicon: 'https://github.githubassets.com/favicons/favicon.png',
    type: 'github',
  },
  'youtube.com': {
    url: 'https://youtube.com',
    domain: 'youtube.com',
    title: 'YouTube',
    favicon: 'https://www.youtube.com/s/desktop/5a70cfcb/img/favicon.ico',
    type: 'youtube',
  },
  'news.ycombinator.com': {
    url: 'https://news.ycombinator.com',
    domain: 'news.ycombinator.com',
    title: 'Hacker News',
    favicon: 'https://news.ycombinator.com/favicon.ico',
    type: 'hackernews',
  },
  'wikipedia.org': {
    url: 'https://en.wikipedia.org/wiki/Main_Page',
    domain: 'en.wikipedia.org',
    title: 'Wikipedia, the free encyclopedia',
    favicon: 'https://en.wikipedia.org/static/favicon/wikipedia.ico',
    type: 'wikipedia',
  },
};

export function resolveUrl(input: string): { url: string; domain: string; title: string; searchQuery?: string; type: string } {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  // If command like "Open Google" or "Go to YouTube"
  if (lower.startsWith('open ') || lower.startsWith('go to ')) {
    const target = lower.replace(/^open\s+|^go\s+to\s+/, '').trim();
    if (target.includes('google')) {
      return { url: 'https://www.google.com', domain: 'google.com', title: 'Google', type: 'google' };
    }
    if (target.includes('youtube')) {
      return { url: 'https://www.youtube.com', domain: 'youtube.com', title: 'YouTube', type: 'youtube' };
    }
    if (target.includes('github')) {
      return { url: 'https://github.com', domain: 'github.com', title: 'GitHub', type: 'github' };
    }
    if (target.includes('hacker news') || target.includes('hn')) {
      return { url: 'https://news.ycombinator.com', domain: 'news.ycombinator.com', title: 'Hacker News', type: 'hackernews' };
    }
    if (target.includes('wikipedia') || target.includes('wiki')) {
      return { url: 'https://en.wikipedia.org', domain: 'wikipedia.org', title: 'Wikipedia', type: 'wikipedia' };
    }
    // Search query or generic URL
    if (target.includes('.')) {
      const cleanUrl = target.startsWith('http') ? target : `https://${target}`;
      try {
        const urlObj = new URL(cleanUrl);
        return { url: cleanUrl, domain: urlObj.hostname, title: target, type: 'generic' };
      } catch {
        // Fallback to google search
      }
    }
    return {
      url: `https://www.google.com/search?q=${encodeURIComponent(target)}`,
      domain: 'google.com',
      title: `${target} - Google Search`,
      searchQuery: target,
      type: 'google',
    };
  }

  // If search command like "Search for ..." or "Search the web for ..."
  if (lower.startsWith('search for ') || lower.startsWith('search ')) {
    const query = trimmed.replace(/^search\s+for\s+|^search\s+the\s+web\s+for\s+|^search\s+/i, '').trim();
    return {
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      domain: 'google.com',
      title: `${query} - Google Search`,
      searchQuery: query,
      type: 'google',
    };
  }

  // If direct URL like "google.com" or "https://..."
  if (lower.includes('.') && !lower.includes(' ')) {
    const cleanUrl = lower.startsWith('http://') || lower.startsWith('https://') ? trimmed : `https://${trimmed}`;
    try {
      const urlObj = new URL(cleanUrl);
      const host = urlObj.hostname.replace(/^www\./, '');
      if (host.includes('google')) {
        const query = urlObj.searchParams.get('q') || undefined;
        return { url: cleanUrl, domain: 'google.com', title: query ? `${query} - Google Search` : 'Google', searchQuery: query, type: 'google' };
      }
      if (host.includes('github')) {
        return { url: cleanUrl, domain: 'github.com', title: 'GitHub', type: 'github' };
      }
      if (host.includes('youtube')) {
        return { url: cleanUrl, domain: 'youtube.com', title: 'YouTube', type: 'youtube' };
      }
      if (host.includes('ycombinator')) {
        return { url: cleanUrl, domain: 'news.ycombinator.com', title: 'Hacker News', type: 'hackernews' };
      }
      if (host.includes('wikipedia')) {
        return { url: cleanUrl, domain: 'wikipedia.org', title: 'Wikipedia', type: 'wikipedia' };
      }
      return { url: cleanUrl, domain: host, title: host, type: 'generic' };
    } catch {
      // Fallback to search
    }
  }

  // Default fallback: Treat natural phrase as search query
  return {
    url: `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`,
    domain: 'google.com',
    title: `${trimmed} - Google Search`,
    searchQuery: trimmed,
    type: 'google',
  };
}
