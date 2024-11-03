import {z} from 'zod';

export const employeeSchema = z.object({
  firstName: z
    .string()
    .min(2, {message: 'First name must be at least 2 characters'})
    .max(50, {message: 'First name must be less than 50 characters'}),
  lastName: z
    .string()
    .min(2, {message: 'Last name must be at least 2 characters'})
    .max(50, {message: 'Last name must be less than 50 characters'}),
  dateOfBirth: z.string().min(1, {message: 'Date of birth is required'}),
  dateOfEmployment: z.string().min(1, {message: 'Employment date is required'}),
  phone: z
    .string()
    .min(1, {message: 'Phone number is required'})
    .regex(/^\+?[\d\s-]{10,}$/, {
      message: 'Please enter a valid phone number',
    }),
  email: z
    .string()
    .min(1, {message: 'Email is required'})
    .email({message: 'Please enter a valid email address'}),
  department: z.string().min(1, {message: 'Department is required'}),
  position: z.string().min(1, {message: 'Position is required'}),
});
