import { z } from 'zod'

const maxSellingDate = new Date(); // Hoje
const minSellingDate = new Date(1960, 0, 1); // Define a data mínima para 1 de janeiro de 1960
const maxYearManufacture = new Date();
maxYearManufacture.setFullYear(maxYearManufacture.getFullYear());

// Extrair apenas o ano de minSellingDate e maxYearManufacture para comparação com year_manufacture
const minYear = minSellingDate.getFullYear();
const maxYear = maxYearManufacture.getFullYear();

export default z.object({
  brand: z
    .string()
    .max(25, { message: 'A marca deve ter, no máximo, 25 caracteres' }),

  model: z
    .string()
    .max(25, { message: 'O modelo deve ter, no máximo, 25 caracteres' }),

  color: z
    .string()
    .max(12, { message: 'A cor pode ter, no máximo, 12 caracteres' }),

  year_manufacture: z.coerce
    .number()
    .min(minYear, {
      message: `O ano de fabricação deve ser maior que ${minYear}`,
    })
    .max(maxYear, {
      message: `O ano de fabricação deve ser menor que ${maxYear}`,
    }),

  imported: z.boolean(),

  plates: z
    .string()
    .max(8, { message: 'A Placa pode ter, no máximo, 8 caracteres' }),

  selling_date: z.coerce
    .date()
    .min(minSellingDate, { message: 'Data de venda está muito no passado' })
    .max(maxSellingDate, {
      message: 'Data de venda não deve ser maior que a data atual',
    })
    .nullable(),

  selling_price: z.coerce
    .number()
    .gte(1000, { message: 'O valor deve ser maior que R$ 1.000' })
    .lte(5000000, { message: 'O valor deve ser menor que R$ 5.000.000' })
    .nullable(),
});
