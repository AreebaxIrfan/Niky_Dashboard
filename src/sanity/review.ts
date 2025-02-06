export default {
    name: "review",
    title: "Review",
    type: "document",
    fields: [
      {
        name: "product",
        title: "Product",
        type: "reference",
        to: [{ type: "product" }],
      },
      {
        name: "rating",
        title: "Rating",
        type: "number",
        validation: (Rule: any) => Rule.required().min(1).max(5),
      },
      {
        name: "comment",
        title: "Comment",
        type: "text",
      },
      {
        name: "phone",
        title: "Phone",
        type: "string",
      },
      {
        name: "email",
        title: "Email",
        type: "string",
      },
    ],
  }