
export interface Chat {
  id: string;
  tableId: string;
  participants: string[];
  comments: Comment[];
};

export interface Comment {
  id: string;
  chatId: string;
  timestamp: number;
  author: string;
  content: string;
};
