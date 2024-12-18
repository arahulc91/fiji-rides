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
    latitude: number;
    longitude: number;
    
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
  
  export interface BookingRequest {
    return_type: "one-way" | "return";
    pax: number;
    pickup_location_id: number;
    dropoff_location_id: number;
    pickup_date: string;
    return_date?: string;
    addons: Record<string, string>[];
    email: string;
    full_name: string;
    terms_and_conditions_accepted: boolean;
    tour_date?: string;
  }
  
  export interface BookingResponse {
    message: string;
    payment_url: string;
    app_id: string;
    order_id: string;
  }
  