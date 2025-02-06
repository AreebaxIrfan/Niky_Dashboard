// customer.js
export default {
    name: 'customer',
    title: 'Customer',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string',
      },
      {
        name: 'email',
        title: 'Email',
        type: 'string',
      },
      {
        name: 'phone',
        title: 'Phone Number',
        type: 'string',
      },
      {
        name: 'pan',
        title: 'PAN',
        type: 'string',
      },
      {
        name: 'createdAt',
        type: 'datetime',
        title: 'Created At',
        description: 'The timestamp when the order was created'
      },
      {
        name: 'address',
        title: 'Address',
        type: 'object',
        fields: [
          { name: 'addressLine1', title: 'Address Line 1', type: 'string' },
          { name: 'addressLine2', title: 'Address Line 2', type: 'string' },
          { name: 'addressLine3', title: 'Address Line 3', type: 'string' },
          { name: 'postalCode', title: 'Postal Code', type: 'string' },
          { name: 'locality', title: 'Locality', type: 'string' },
          { name: 'state', title: 'State', type: 'string' },
          { name: 'country', title: 'Country', type: 'string', initialValue: 'Pakistan' },
        ],
      },
    ],
  }
  