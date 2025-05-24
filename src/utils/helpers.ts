// Generate unique ID for rectangles
export const generateId = (): string => 
  `rect_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

