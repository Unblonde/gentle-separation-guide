
export interface Holiday {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  withParent: string;
  location: string;
  pickupTime: string;
  pickupLocation: string;
  dropoffTime: string;
  dropoffLocation: string;
  // Additional fields for database operations
  family_id?: string;
  created_by?: string;
}
