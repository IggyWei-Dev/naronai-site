export type ProductTier = 'Signature' | 'Couture' | 'Bespoke'

export interface Product {
  id:          string
  slug:        string
  name:        string
  description: string
  price:       number
  images:      string[]
  tier?:       ProductTier
  inStock:     boolean
  isNew?:      boolean
  hairType?:   string
  length?:     string
  density?:    string
  capType?:    string
  origin?:     string
  colors?:     ProductColor[]
  lengths?:    string[]
  category?:   string
  createdAt:   string
}

export interface ProductColor {
  name:  string
  hex:   string
  image?: string
}

export interface CartItem {
  product:      Product
  quantity:     number
  selectedColor?: string
  selectedLength?: string
}

export interface Order {
  id:            string
  userId?:       string
  guestEmail?:   string
  items:         CartItem[]
  total:         number
  status:        OrderStatus
  paystackRef:   string
  shippingAddress: Address
  createdAt:     string
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface Address {
  firstName: string
  lastName:  string
  email:     string
  phone:     string
  line1:     string
  line2?:    string
  city:      string
  state:     string
  country:   string
}

export interface User {
  id:        string
  email:     string
  firstName?: string
  lastName?:  string
  phone?:     string
  createdAt:  string
}
