export default {
    name: 'user',
    type: 'document',
    title: 'User',
    fields: [
      {
        name: 'email',
        type: 'string',
        title: 'Email',
        validation: (Rule: { required: () => { (): any; new(): any; email: { (): any; new(): any; }; }; }) => Rule.required().email()
      },
      {
        name: 'password',
        type: 'string',
        title: 'Hashed Password',
        validation: (Rule: { required: () => any; }) => Rule.required()
      },
      {
        name: 'role',
        type: 'string',
        title: 'Role',
        options: {
          list: [
            { title: 'Admin', value: 'admin' },
            { title: 'Product Manager', value: 'productManager' },
            { title: 'Shipment Manager', value: 'shipmentManager' }
          ],
          layout: 'radio'
        },
        validation: (Rule: { required: () => any; }) => Rule.required()
      }
    ]
  }