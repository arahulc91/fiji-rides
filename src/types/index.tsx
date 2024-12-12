// Type for API response
export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
  }
  
  // Update the interface
  export interface PickupDropoffLocation {
    id: number;
    description: string;
  }
  