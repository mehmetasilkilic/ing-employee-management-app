import {z} from 'zod';
import i18next from 'i18next';

export const createEmployeeSchema = () => {
  const t = i18next.t.bind(i18next);

  return z.object({
    firstName: z
      .string()
      .min(2, {message: t('validation.firstName.min', {min: 2})})
      .max(50, {message: t('validation.firstName.max', {max: 50})}),
    lastName: z
      .string()
      .min(2, {message: t('validation.lastName.min', {min: 2})})
      .max(50, {message: t('validation.lastName.max', {max: 50})}),
    dateOfBirth: z
      .string()
      .min(1, {message: t('validation.dateOfBirth.required')}),
    dateOfEmployment: z
      .string()
      .min(1, {message: t('validation.dateOfEmployment.required')}),
    phone: z
      .string()
      .min(1, {message: t('validation.phone.required')})
      .regex(/^\+?[\d\s-]{10,}$/, {
        message: t('validation.phone.invalid'),
      }),
    email: z
      .string()
      .min(1, {message: t('validation.email.required')})
      .email({message: t('validation.email.invalid')}),
    department: z
      .string()
      .min(1, {message: t('validation.department.required')}),
    position: z.string().min(1, {message: t('validation.position.required')}),
  });
};
