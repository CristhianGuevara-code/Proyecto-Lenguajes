export interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: string;
  type: "consulta" | "aviso";
  comments: ForumComment[];
}

export interface ForumComment {
  id: number;
  content: string;
  author: string;
}
