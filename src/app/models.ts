export interface Address {
  country?: string
  zip?: string
  city?: string
  addressLine1?: string
  addressLine2?: string
}

export enum PhoneTypes {
  line,
  mobile
}
export interface Phone {
  type: PhoneTypes,
  value: string
}
export interface Person {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phones: Phone []
  address: Address
}
