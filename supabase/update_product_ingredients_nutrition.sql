with product_updates(slug, ingredients, nutrition) as (
  values
    (
      'peri-peri-almond-butter',
      array['Almonds', 'Peri peri spices', 'Salt']::text[],
      '{
        "serving_size": "per 100g",
        "energy_kcal": 642.49,
        "total_carbohydrates_g": 28.40,
        "protein_g": 6.85,
        "total_sugar_g": 28.68,
        "total_fat_g": 51.25,
        "moisture_g": 1.44,
        "total_ash_g": 12.00,
        "saturated_fat_g": 4.60,
        "pufa_g": 42.72,
        "mufa_g": 0.96,
        "trans_fat_g": "Less than 0.01",
        "cholesterol_g": "Less than 0.01"
      }'::jsonb
    ),
    (
      'masala-peanut-butter',
      array['Peanut', 'Chilli powder', 'Salt', 'Curry leaves', 'Asafoetida', 'Cold-pressed groundnut oil']::text[],
      '{
        "serving_size": "per 100g",
        "energy_kcal": 595.62,
        "total_carbohydrates_g": 28.93,
        "protein_g": 6.95,
        "total_sugar_g": 9.21,
        "total_fat_g": 50.22,
        "moisture_g": 1.37,
        "total_ash_g": 12.50,
        "saturated_fat_g": 9.03,
        "pufa_g": 37.89,
        "mufa_g": 0.96,
        "trans_fat_g": "Less than 0.01",
        "cholesterol_g": "Less than 0.01"
      }'::jsonb
    ),
    (
      'herby-cashew-butter',
      array['Cashew', 'Mixed herbs', 'Ground pepper']::text[],
      '{
        "serving_size": "per 100g",
        "energy_kcal": 501.11,
        "total_carbohydrates_g": 37.50,
        "protein_g": 6.52,
        "total_sugar_g": 30.58,
        "total_fat_g": 43.41,
        "moisture_g": 0.92,
        "total_ash_g": 11.40,
        "saturated_fat_g": 8.71,
        "pufa_g": 33.29,
        "mufa_g": 1.29,
        "trans_fat_g": "Less than 0.01",
        "cholesterol_g": "Less than 0.01"
      }'::jsonb
    ),
    (
      'royal-pistachio-butter',
      array['Pistachio', 'Saffron', 'Salt', 'Ground pepper']::text[],
      '{
        "serving_size": "per 100g",
        "energy_kcal": 546.86,
        "total_carbohydrates_g": 40.26,
        "protein_g": 1.91,
        "total_sugar_g": "Less than 1",
        "total_fat_g": 38.02,
        "moisture_g": 1.49,
        "total_ash_g": 9.32,
        "saturated_fat_g": 6.27,
        "pufa_g": 30.20,
        "mufa_g": 0.50,
        "trans_fat_g": "Less than 0.01",
        "cholesterol_g": "Less than 0.01"
      }'::jsonb
    ),
    (
      'hazelnut-nutella-butter',
      array['Hazelnut', 'Cacao powder', 'Dark chocolate', 'Coconut sugar', 'Vanilla']::text[],
      '{
        "serving_size": "per 100g",
        "energy_kcal": 623.40,
        "total_carbohydrates_g": 36.06,
        "protein_g": 4.68,
        "total_sugar_g": 10.17,
        "total_fat_g": 51.16,
        "moisture_g": 2.10,
        "total_ash_g": 6.00,
        "saturated_fat_g": 10.85,
        "pufa_g": 31.28,
        "mufa_g": 5.13,
        "trans_fat_g": "Less than 0.01",
        "cholesterol_g": "Less than 0.01"
      }'::jsonb
    ),
    (
      'zesty-cacao-almond-butter',
      array['Almonds', 'Cacao powder', 'Coconut sugar', 'Orange', 'Vanilla']::text[],
      '{
        "serving_size": "per 100g",
        "energy_kcal": 531.32,
        "total_carbohydrates_g": 49.54,
        "protein_g": 8.95,
        "total_sugar_g": 26.40,
        "total_fat_g": 33.04,
        "moisture_g": 2.90,
        "total_ash_g": 5.21,
        "saturated_fat_g": 7.36,
        "pufa_g": 20.41,
        "mufa_g": 3.66,
        "trans_fat_g": "Less than 0.01",
        "cholesterol_g": "Less than 0.01"
      }'::jsonb
    ),
    (
      'minty-pumpkin-seed-butter',
      array['Pumpkin seeds', 'Mint', 'Spices', 'Salt']::text[],
      '{
        "serving_size": "per 100g",
        "energy_kcal": 592.14,
        "total_carbohydrates_g": 35.63,
        "protein_g": 7.51,
        "total_sugar_g": 4.00,
        "total_fat_g": 46.62,
        "moisture_g": 1.65,
        "total_ash_g": 8.59,
        "saturated_fat_g": 7.01,
        "pufa_g": 21.59,
        "mufa_g": 13.55,
        "trans_fat_g": "Less than 0.01",
        "cholesterol_g": "Less than 0.01"
      }'::jsonb
    ),
    (
      'omega-seed-butter',
      array['Pumpkin seeds', 'Sunflower seeds', 'Chia seeds', 'Flax seeds', 'Hemp seeds', 'Salt', 'Mixed herbs']::text[],
      '{
        "serving_size": "per 100g",
        "energy_kcal": 600.21,
        "total_carbohydrates_g": 38.56,
        "protein_g": 7.46,
        "total_sugar_g": "Less than 1",
        "total_fat_g": 46.24,
        "moisture_g": 2.00,
        "total_ash_g": 5.74,
        "saturated_fat_g": 6.32,
        "pufa_g": 37.87,
        "mufa_g": 1.44,
        "trans_fat_g": "Less than 0.01",
        "cholesterol_g": "Less than 0.01"
      }'::jsonb
    )
)
update public.products as p
set
  ingredients = product_updates.ingredients,
  nutrition = product_updates.nutrition,
  updated_at = now()
from product_updates
where p.slug = product_updates.slug;
