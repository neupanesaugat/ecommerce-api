import Yup from "yup";

export const addProductValidationSchema = Yup.object({
  name: Yup.string().required().trim().max(55),
  brand: Yup.string().required().trim().max(),
  price: 1500,
  quantity: 7,
  category: "electronics",
  freeShipping: true,
  description: "This is the best mouse in 2024",
});
