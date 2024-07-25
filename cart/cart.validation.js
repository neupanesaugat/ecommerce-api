import Yup from "yup";

export const addCartItemsValidationSchema = Yup.object({
  productId: Yup.string().required().trim(),
  orderQuantity: Yup.number().min(1).required(),
});
