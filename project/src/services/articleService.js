// Mock article data for demonstration purposes
const articles = [
  {
    id: 1,
    title: "The Future of Renewable Energy",
    excerpt: "An in-depth look at how renewable energy is reshaping our world's power infrastructure.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    imageUrl: "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg",
    category: "technology",
    author: "Sarah Chen",
    authorImage: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    date: "2025-02-15",
    readTime: "8 min read",
    likes: 234
  },
  {
    id: 2,
    title: "Global Economic Trends 2025",
    excerpt: "Analysis of emerging economic patterns and their impact on global markets.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    imageUrl: "https://images.pexels.com/photos/187041/pexels-photo-187041.jpeg",
    category: "economics",
    author: "James Wilson",
    authorImage: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    date: "2025-02-14",
    readTime: "12 min read",
    likes: 186
  },
  {
    id: 3,
    title: "The Rise of AI in Healthcare",
    excerpt: "How artificial intelligence is revolutionizing medical diagnosis and treatment.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    imageUrl: "https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg",
    category: "health",
    author: "Dr. Emily Roberts",
    authorImage: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    date: "2025-02-13",
    readTime: "10 min read",
    likes: 342
  },
  {
    id: 4,
    title: "Sustainable Urban Development",
    excerpt: "Exploring innovative approaches to building environmentally conscious cities.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    imageUrl: "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg",
    category: "environment",
    author: "Michael Green",
    authorImage: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg",
    date: "2025-02-12",
    readTime: "15 min read",
    likes: 156
  },
  {
    id: 5,
    title: "The Psychology of Social Media",
    excerpt: "Understanding the mental health impacts of digital connectivity.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    imageUrl: "https://images.pexels.com/photos/267399/pexels-photo-267399.jpeg",
    category: "psychology",
    author: "Dr. Lisa Thompson",
    authorImage: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
    date: "2025-02-11",
    readTime: "7 min read",
    likes: 289
  },
  {
    id: 6,
    title: "Space Exploration Breakthroughs",
    excerpt: "Latest discoveries and achievements in our journey to the stars.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    imageUrl: "https://images.pexels.com/photos/41162/moon-landing-apollo-11-nasa-buzz-aldrin-41162.jpeg",
    category: "science",
    author: "Alex Martinez",
    authorImage: "https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg",
    date: "2025-02-10",
    readTime: "9 min read",
    likes: 421
  },
  {
    id: 7,
    title: "The Evolution of Remote Work",
    excerpt: "How workplace culture is adapting to the digital age.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    imageUrl: "https://images.pexels.com/photos/4064835/pexels-photo-4064835.jpeg",
    category: "business",
    author: "Rachel Kim",
    authorImage: "https://images.pexels.com/photos/1181695/pexels-photo-1181695.jpeg",
    date: "2025-02-09",
    readTime: "11 min read",
    likes: 167
  },
  {
    id: 8,
    title: "Cybersecurity in the Modern Age",
    excerpt: "Essential strategies for protecting digital assets and privacy.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    imageUrl: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg",
    category: "technology",
    author: "David Chen",
    authorImage: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg",
    date: "2025-02-08",
    readTime: "13 min read",
    likes: 298
  }
];

// Simulate API call to fetch articles
export const getArticles = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(articles);
    }, 800);
  });
};

// Get article by ID
export const getArticleById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const article = articles.find(a => a.id === parseInt(id));
      if (article) {
        resolve(article);
      } else {
        reject(new Error('Article not found'));
      }
    }, 300);
  });
};