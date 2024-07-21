import Yup from "yup";

export const userValidationSchema = Yup.object({
  email: Yup.string().required().lowercase().trim().max(55).email(),
  password: Yup.string().required().trim(),
  firstName: Yup.string().required().trim().max(30),
  lastName: Yup.string().required().trim().max(30),
  gender: Yup.string().required().oneOf(["male", "female", "other"]),
  role: Yup.string().required().oneOf(["buyer", "seller"]),
});

export const loginUserValidationSchema = Yup.object({
  email: Yup.string().required().lowercase().trim().email(),
  password: Yup.string().required().trim(),
});
