export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  department: string;
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
export type Status = "Pending" | "In Process" | "Resolved" | "Completed" | "Rejected";
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
  bio?: string;
  country?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  tax_id?: string;
}

// Table view model used by ComplaintsTable
export interface ComplaintTableItem {
  id: number;
  complaint_id: string;
  user: {
    image: string;
    name: string;
    role: string;
    department: string;
    email: string;
  };
  description: string;
  category: string;
  subject: string;
  priority: string;
  status: Status;
  image: string | null;
  assignedTo: string;
  created_by: string;
  created_at: string;
  updated_at: string;

}
export interface Complaint {
  id: number;
  complaint_id: string;
  title: string;
  description: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  image: string | null;
  assigned_to: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type Announcement = {
  id: number;
  title: string;
  message: string;
  created_by: string;
  createdAt: string;
  creator: {
    image: string;
    name: string;
    email: string;
  };
};