export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskCategoryAssociation {
  taskId: string;
  categoryIds: string[];
}
