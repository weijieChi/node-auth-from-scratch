export interface RegisterDTO {
  username: string;
  password: string;
}

export interface LoginDTO {
  username: string;
  password: string;
}

// DTO: Data Transfer Object 
// 它的用途是： 在 Controller <-> Service <-> Repository 之間傳遞資料時，用的「固定資料格式」。