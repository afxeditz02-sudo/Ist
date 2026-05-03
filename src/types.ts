export interface Author {
  uid: string;
  name: string;
  avatar: string;
  followers?: string[];
  following?: string[];
}

export interface Post {
  id: string;
  imageUrls: string[];
  caption: string;
  author: Author;
  likes: number;
  likedBy?: string[];
  savedBy?: string[];
  createdAt: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface Story {
  id: string;
  imageUrl: string;
  author: Author;
  createdAt: number;
  isViewed: boolean;
  viewedBy?: string[];
}
