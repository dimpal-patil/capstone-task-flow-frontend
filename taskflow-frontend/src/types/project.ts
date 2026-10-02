export interface Project {
  _id: string;
  name: string;
  description: string;
  status: "active" | "archived";
  owner: string;
}