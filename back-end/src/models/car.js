import { z } from 'zod'

const maxSellingDate = new Date(); // Hoje
const minSellingDate = new Date(1960, 0, 1); // Define a data mínima para 1 de janeiro de 1960
const maxYearManufacture = new Date()
maxYearManufacture.setFullYear(maxYearManufacture.getFullYear())

export default z.object({
  brand: z
    .string()
    .max(25, { message: 'O marca deve ter, no máximo, 25 caracteres' }),

  model: z
    .string()
    .max(25, { message: 'O modelo deve ter, no máximo, 25 caracteres' }),

  color: z
    .string()
    .max(12, { message: 'A cor deve pode ter, no máximo, 12 caracteres' }),

  year_manufacture: z.coerce
    .number()
    .min(minSellingDate, {
      message: 'O ano de fabricação deve ser maior que 1960',
    })
    .max(maxYearManufacture, {
      message: 'O ano de fabricação deve ser menor que ' + maxYearManufacture,
    }),

  imported: z.boolean(),

  plates: z
    .string()
    .max(8, { message: 'A Placa pode ter, no máximo, 8 caracteres' }),

  selling_date:
    // coerce força a conversão para o tipo Date, se o valor recebido for string
    z.coerce
      .date()
      .min(minSellingDate, { message: 'Data de venda está muito no passado' })
      .max(maxSellingDate, {
        message: 'Data de venda não deve ser maior que data atual',
      })
      .nullable(),

  selling_price: z.coerce
    .number()
    .gte(1000, { message: 'O valor deve ser maior que R$ 1.000' })
    .lte(5000000, { message: 'O valor deve ser menor que R$ 5.000.000' })
    .nullable(),
});