export interface User {
  id: string;
  image: string;
  name: string;
  email: string;
}

export interface Complaint {
  id: number;
  title: string;
  category: string;
  priority: string;
  status: string;
  description: string;
  image: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}
export interface Student {
  id: number;
  student: {
    image: string;
    name: string;
    regNo: string;
  };
  title: string;
  category: string;
  status: string;
  submittedAt: string;
}
export type Status = "Pending" | "In Progress" | "Resolved" | "Completed" | "Rejected";
export interface ComplaintForm {
  id: string;
  title: string;
  description: string;
  status: Status;
  assignedTo: string;
  createdAt: string;
  priority?: "Low" | "Medium" | "High";
  category?: string;
}
export interface UserData {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
  department?: string;
  image?: string;
  gender?: string;
}

// Table view model used by ComplaintsTable
export interface ComplaintTableItem {
  id: number;
  user: {
    image: string;
    name: string;
    email: string;
  };
  category: string;
  subject: string;
  priority: string;
  status: string;
  date: string;
}