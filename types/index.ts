export interface User {
  id: string
  username: string
  role: 'admin' | 'sales'
  name: string
  region?: string
}

export interface Outlet {
  id: string
  name: string
  region: string
  address: string
  phone: string
  totalOrders: number
  isActive: boolean
  salesPersonId?: string
}

export interface Order {
  id: string
  outletId: string
  productName: string
  quantity: number
  price: number
  date: string
  status: 'pending' | 'completed' | 'cancelled'
}

export interface SalesData {
  region: string
  total: number
}