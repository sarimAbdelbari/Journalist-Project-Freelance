// Import the allowed categories
import { allowedCategories } from './articleService';

// Dummy journalist data with expertise areas aligned to allowed categories
const journalists = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    profileImage: 'https://randomuser.me/api/portraits/women/24.jpg',
    bio: 'Sarah is a seasoned technology journalist with over 10 years of experience covering renewable energy and sustainability innovations.',
    joinedDate: '2020-03-15',
    socialLinks: {
      twitter: 'https://twitter.com/sarahchen',
      linkedin: 'https://linkedin.com/in/sarahchen'
    },
    expertiseAreas: ['technology', 'science', 'business']
  },
  {
    id: '2',
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'James specializes in economic analysis and global market trends with a particular focus on emerging markets.',
    joinedDate: '2019-08-22',
    socialLinks: {
      twitter: 'https://twitter.com/jameswilson',
      linkedin: 'https://linkedin.com/in/jameswilson'
    },
    expertiseAreas: ['business', 'politics', 'technology']
  },
  {
    id: '3',
    name: 'Dr. Emily Roberts',
    email: 'emily.roberts@example.com',
    profileImage: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    bio: 'Dr. Roberts is a health correspondent with a background in medicine, focusing on healthcare technology and medical research.',
    joinedDate: '2021-01-10',
    socialLinks: {
      twitter: 'https://twitter.com/dremroberts',
      linkedin: 'https://linkedin.com/in/emilyroberts'
    },
    expertiseAreas: ['health', 'science', 'technology']
  },
  {
    id: '4',
    name: 'Michael Green',
    email: 'michael.green@example.com',
    profileImage: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
    bio: 'Michael covers urban development and city planning with a focus on sustainable architecture and environmental policy.',
    joinedDate: '2020-06-05',
    socialLinks: {
      twitter: 'https://twitter.com/michaelgreen',
      linkedin: 'https://linkedin.com/in/michaelgreen'
    },
    expertiseAreas: ['science', 'politics', 'other']
  },
  {
    id: '5',
    name: 'Dr. Lisa Thompson',
    email: 'lisa.thompson@example.com',
    profileImage: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    bio: 'A psychology expert specializing in digital behavior and the impacts of social media on mental health.',
    joinedDate: '2019-11-30',
    socialLinks: {
      twitter: 'https://twitter.com/drlisathompson',
      linkedin: 'https://linkedin.com/in/lisathompson'
    },
    expertiseAreas: ['health', 'entertainment', 'technology']
  },
  {
    id: '6',
    name: 'Carlos Rodriguez',
    email: 'carlos.rodriguez@example.com',
    profileImage: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    bio: 'Sports analyst with expertise in football, basketball, and Olympic events. Former professional athlete turned journalist.',
    joinedDate: '2021-03-10',
    socialLinks: {
      twitter: 'https://twitter.com/carlosrodriguez',
      linkedin: 'https://linkedin.com/in/carlosrodriguez'
    },
    expertiseAreas: ['sports', 'entertainment', 'health']
  },
  {
    id: '7',
    name: 'Jennifer Adams',
    email: 'jennifer.adams@example.com',
    profileImage: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
    bio: 'Political correspondent covering national and international politics, with a focus on policy analysis and electoral systems.',
    joinedDate: '2020-08-15',
    socialLinks: {
      twitter: 'https://twitter.com/jenniferadams',
      linkedin: 'https://linkedin.com/in/jenniferadams'
    },
    expertiseAreas: ['politics', 'business', 'other']
  }
];

// Enhanced article data with authorId
const enhancedArticleData = [
  {
    id: 1,
    authorId: '1', // Sarah Chen
    views: 5420
  },
  {
    id: 2,
    authorId: '2', // James Wilson
    views: 4180
  },
  {
    id: 3,
    authorId: '3', // Dr. Emily Roberts
    views: 6250
  },
  {
    id: 4,
    authorId: '4', // Michael Green
    views: 3680
  },
  {
    id: 5,
    authorId: '5', // Dr. Lisa Thompson
    views: 4890
  },
  {
    id: 6,
    authorId: '1', // Sarah Chen
    views: 3740
  },
  {
    id: 7,
    authorId: '2', // James Wilson
    views: 2960
  },
  {
    id: 8,
    authorId: '1', // Sarah Chen
    views: 5120
  },
  {
    id: 9,
    authorId: '7', // Jennifer Adams
    views: 4250
  },
  {
    id: 10,
    authorId: '6', // Carlos Rodriguez
    views: 5820
  }
];

// Get all journalists
export const getJournalists = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(journalists);
    }, 500);
  });
};

// Get journalist by ID
export const getJournalistById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const journalist = journalists.find(j => j.id === id);
      if (journalist) {
        resolve(journalist);
      } else {
        reject(new Error('Journalist not found'));
      }
    }, 300);
  });
};

// Get journalist expertise categories (ensures they match allowed categories)
export const getJournalistExpertiseAreas = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Only return valid expertise areas that match the allowed categories
      const validExpertiseAreas = [...new Set(
        journalists.flatMap(journalist => 
          journalist.expertiseAreas.filter(area => 
            allowedCategories.includes(area)
          )
        )
      )].sort();
      
      resolve(validExpertiseAreas);
    }, 300);
  });
};

// Get article view counts
export const getArticleViewCount = (articleId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const article = enhancedArticleData.find(a => a.id === parseInt(articleId));
      resolve(article ? article.views : 0);
    }, 200);
  });
};

// Get total views for a journalist
export const getJournalistTotalViews = (journalistId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get all articles by this journalist
      const journalistArticles = enhancedArticleData.filter(
        article => article.authorId === journalistId
      );
      
      // Sum the views
      const totalViews = journalistArticles.reduce(
        (sum, article) => sum + article.views, 0
      );
      
      resolve(totalViews);
    }, 400);
  });
};

// Get articles by journalist
export const getArticlesByJournalist = (journalistId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get IDs of articles by this journalist
      const articleIds = enhancedArticleData
        .filter(article => article.authorId === journalistId)
        .map(article => article.id);
      
      resolve(articleIds);
    }, 300);
  });
};

// Update existing article service to include authorId and views
export const updateArticleService = () => {
  const originalGetArticleById = window.getArticleById;
  
  window.getArticleById = async (id) => {
    const article = await originalGetArticleById(id);
    const enhancedData = enhancedArticleData.find(a => a.id === parseInt(id));
    
    if (enhancedData) {
      return {
        ...article,
        authorId: enhancedData.authorId,
        views: enhancedData.views
      };
    }
    
    return article;
  };
};