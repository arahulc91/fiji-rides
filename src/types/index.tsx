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
  
  export interface TransferAddon {
    id: number;
    addon: string;
    company: string;
    price: string;
    return_type: string;
    additional_details: string;
    photos: string[];
    is_tour_addon: boolean;
  }
  
  export interface TransferOption {
    id: number;
    price: string;
    transfer_option: string;
    transfer_company: string;
    vehicle_image_base64: string;
  }
  