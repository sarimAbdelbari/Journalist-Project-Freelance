// Mock comments data for articles
const comments = [
  // Article 1 comments
  {
    id: 101,
    articleId: 1,
    user: {
      id: 201,
      name: "John Rodriguez",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"
    },
    text: "This is a fascinating analysis of renewable energy. I particularly appreciated the section on solar innovations.",
    date: "2025-02-16T14:22:30Z",
    likes: 12
  },
  {
    id: 102,
    articleId: 1,
    user: {
      id: 202,
      name: "Maria Johnson",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg"
    },
    text: "As someone working in the wind energy sector, I found this article to be spot on. Would love to see a follow-up on offshore developments.",
    date: "2025-02-16T15:45:12Z",
    likes: 8
  },
  {
    id: 103,
    articleId: 1,
    user: {
      id: 203,
      name: "Raj Patel",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
    },
    text: "The statistics on renewable energy growth are incredibly encouraging. I hope policymakers are paying attention to this trend.",
    date: "2025-02-17T09:12:45Z",
    likes: 15
  },

  // Article 2 comments
  {
    id: 104,
    articleId: 2,
    user: {
      id: 204,
      name: "Sophia Williams",
      avatar: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg"
    },
    text: "The economic forecast presented here seems overly optimistic given current inflation rates. Would be interested in seeing more data.",
    date: "2025-02-14T18:30:22Z",
    likes: 6
  },
  {
    id: 105,
    articleId: 2,
    user: {
      id: 205,
      name: "Thomas Garcia",
      avatar: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg"
    },
    text: "Very insightful analysis of emerging markets. I've shared this with my economics students as required reading.",
    date: "2025-02-15T10:17:39Z",
    likes: 23
  },

  // Article 3 comments
  {
    id: 106,
    articleId: 3,
    user: {
      id: 206,
      name: "Dr. Anna Kim",
      avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg"
    },
    text: "As a physician, I'm cautiously optimistic about AI in healthcare. This article does a great job balancing the potential with practical limitations.",
    date: "2025-02-13T21:05:14Z",
    likes: 31
  },
  {
    id: 107,
    articleId: 3,
    user: {
      id: 207,
      name: "Marcus Johnson",
      avatar: "https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg"
    },
    text: "My hospital recently implemented an AI diagnostic system similar to what's described here. The results have been promising but challenges remain.",
    date: "2025-02-14T08:43:51Z",
    likes: 19
  },
  {
    id: 108,
    articleId: 3,
    user: {
      id: 208,
      name: "Elena Rodriguez",
      avatar: "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg"
    },
    text: "I'd be interested in a follow-up article about the ethical implications of AI making medical decisions. Important topic that deserves more attention.",
    date: "2025-02-14T14:22:07Z",
    likes: 27
  },

  // Article 4 comments
  {
    id: 109,
    articleId: 4,
    user: {
      id: 209,
      name: "Carlos Mendez",
      avatar: "https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg"
    },
    text: "Urban planning is my passion, and this article articulates beautifully the challenges we face in balancing growth with sustainability.",
    date: "2025-02-12T16:32:40Z",
    likes: 14
  },
  {
    id: 110,
    articleId: 4,
    user: {
      id: 210,
      name: "Aisha Kamari",
      avatar: "https://images.pexels.com/photos/1820919/pexels-photo-1820919.jpeg"
    },
    text: "The case studies from Singapore and Copenhagen are particularly instructive. We should be adapting these models worldwide.",
    date: "2025-02-13T11:19:02Z",
    likes: 22
  },

  // Article 5 comments
  {
    id: 111,
    articleId: 5,
    user: {
      id: 211,
      name: "Peter Zhang",
      avatar: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg"
    },
    text: "As a parent of teenagers, this article resonated deeply with me. The section on digital boundaries was particularly helpful.",
    date: "2025-02-11T19:48:33Z",
    likes: 16
  },
  {
    id: 112,
    articleId: 5,
    user: {
      id: 212,
      name: "Leslie Morgan",
      avatar: "https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg"
    },
    text: "Would love to see more research on the long-term effects of social media on developing brains. This article is a good start.",
    date: "2025-02-12T09:14:27Z",
    likes: 8
  },

  // Article 6 comments
  {
    id: 113,
    articleId: 6,
    user: {
      id: 213,
      name: "Neil Armstrong Jr.",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
    },
    text: "The Mars mission coverage was comprehensive and accurate. As someone in the aerospace industry, I appreciate the technical details.",
    date: "2025-02-10T22:07:19Z",
    likes: 29
  },
  {
    id: 114,
    articleId: 6,
    user: {
      id: 214,
      name: "Samantha Lee",
      avatar: "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg"
    },
    text: "Space exploration has always fascinated me. This article does a great job explaining complex concepts in accessible language.",
    date: "2025-02-11T07:55:42Z",
    likes: 13
  },
  {
    id: 115,
    articleId: 6,
    user: {
      id: 215,
      name: "David Okonkwo",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg"
    },
    text: "The section on private space companies and their competition with national agencies was particularly insightful.",
    date: "2025-02-11T14:32:50Z",
    likes: 17
  },

  // Article 7 comments
  {
    id: 116,
    articleId: 7,
    user: {
      id: 216,
      name: "Rebecca Chen",
      avatar: "https://images.pexels.com/photos/1840608/pexels-photo-1840608.jpeg"
    },
    text: "As a remote work manager, I found the productivity statistics fascinating. My team's experience aligns with these findings.",
    date: "2025-02-09T16:44:11Z",
    likes: 11
  },
  {
    id: 117,
    articleId: 7,
    user: {
      id: 217,
      name: "Jason Martinez",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
    },
    text: "The section on digital wellbeing and work-life balance is crucial. I've implemented some of these strategies with my team.",
    date: "2025-02-10T08:19:27Z",
    likes: 9
  },

  // Article 8 comments
  {
    id: 118,
    articleId: 8,
    user: {
      id: 218,
      name: "Emma Thompson",
      avatar: "https://images.pexels.com/photos/1520760/pexels-photo-1520760.jpeg"
    },
    text: "The ransomware case studies were eye-opening. I've shared this with our IT department as a cautionary tale.",
    date: "2025-02-08T20:12:38Z",
    likes: 14
  },
  {
    id: 119,
    articleId: 8,
    user: {
      id: 219,
      name: "Sanjay Gupta",
      avatar: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg"
    },
    text: "As a cybersecurity professional, I appreciate the accuracy in this article. The recommendations for small businesses are particularly valuable.",
    date: "2025-02-09T10:05:44Z",
    likes: 26
  },
  {
    id: 120,
    articleId: 8,
    user: {
      id: 220,
      name: "Linda Johnson",
      avatar: "https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg"
    },
    text: "I implemented the password management strategy suggested here and it's made a significant difference in our organization's security posture.",
    date: "2025-02-09T15:38:29Z",
    likes: 18
  }
];

// Get all comments for a specific article
export const getCommentsByArticleId = (articleId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const articleComments = comments.filter(comment => comment.articleId === parseInt(articleId));
      resolve(articleComments);
    }, 500);
  });
};

// Add a new comment to an article
export const addComment = (articleId, userId, text) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create a dummy user if not provided
      const user = {
        id: userId || 999,
        name: "Current User",
        avatar: "https://images.pexels.com/photos/1557843/pexels-photo-1557843.jpeg"
      };
      
      const newComment = {
        id: Math.max(...comments.map(c => c.id)) + 1,
        articleId: parseInt(articleId),
        user,
        text,
        date: new Date().toISOString(),
        likes: 0
      };
      
      comments.push(newComment);
      resolve(newComment);
    }, 300);
  });
};

// Like a comment
export const likeComment = (commentId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const comment = comments.find(c => c.id === parseInt(commentId));
      if (comment) {
        comment.likes += 1;
        resolve(comment);
      } else {
        resolve(null);
      }
    }, 200);
  });
};

// Delete a comment (for admin or comment owner)
export const deleteComment = (commentId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = comments.findIndex(c => c.id === parseInt(commentId));
      if (index !== -1) {
        const deletedComment = comments.splice(index, 1)[0];
        resolve(deletedComment);
      } else {
        resolve(null);
      }
    }, 300);
  });
};