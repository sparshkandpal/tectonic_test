# Clear existing data
CartItem.destroy_all
Hotspot.destroy_all
MediaItem.destroy_all
Story.destroy_all
Substitution.destroy_all
DishIngredient.destroy_all
Dish.destroy_all
Ingredient.destroy_all
Restaurant.destroy_all

# Create Restaurants
restaurant1 = Restaurant.create!(
  name: "Spice Kitchen",
  description: "Authentic Indian cuisine with modern twists",
  logo_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200"
)

restaurant2 = Restaurant.create!(
  name: "Pasta Palace",
  description: "Fresh Italian pasta made daily",
  logo_url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=200"
)

restaurant3 = Restaurant.create!(
  name: "Burger Barn",
  description: "Gourmet burgers with premium ingredients",
  logo_url: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=200"
)

# Create Ingredients
chicken = Ingredient.create!(
  name: "Chicken",
  description: "Free-range chicken breast",
  image_url: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300",
  calories: 231,
  protein: 27.0,
  carbs: 0.0,
  fat: 12.0,
  allergens: ["None"]
)

butter = Ingredient.create!(
  name: "Butter",
  description: "Premium European butter",
  image_url: "https://images.unsplash.com/photo-1589985270826-4b7fe135a9c4?w=300",
  calories: 717,
  protein: 0.9,
  carbs: 0.1,
  fat: 81.0,
  allergens: ["Dairy"]
)

tomato = Ingredient.create!(
  name: "Tomato",
  description: "Fresh vine-ripened tomatoes",
  image_url: "https://images.unsplash.com/photo-1546097491-4c03f48b14d4?w=300",
  calories: 18,
  protein: 0.9,
  carbs: 3.9,
  fat: 0.2,
  allergens: ["None"]
)

cheese = Ingredient.create!(
  name: "Mozzarella Cheese",
  description: "Fresh mozzarella",
  image_url: "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=300",
  calories: 300,
  protein: 22.0,
  carbs: 2.2,
  fat: 22.0,
  allergens: ["Dairy"]
)

lettuce = Ingredient.create!(
  name: "Lettuce",
  description: "Crisp romaine lettuce",
  image_url: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=300",
  calories: 15,
  protein: 1.4,
  carbs: 2.9,
  fat: 0.2,
  allergens: ["None"]
)

onion = Ingredient.create!(
  name: "Onion",
  description: "Sweet yellow onions",
  image_url: "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=300",
  calories: 40,
  protein: 1.1,
  carbs: 9.3,
  fat: 0.1,
  allergens: ["None"]
)

tofu = Ingredient.create!(
  name: "Tofu",
  description: "Organic firm tofu",
  image_url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=300",
  calories: 76,
  protein: 8.0,
  carbs: 1.9,
  fat: 4.8,
  allergens: ["Soy"]
)

olive_oil = Ingredient.create!(
  name: "Olive Oil",
  description: "Extra virgin olive oil",
  image_url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300",
  calories: 884,
  protein: 0.0,
  carbs: 0.0,
  fat: 100.0,
  allergens: ["None"]
)

beef = Ingredient.create!(
  name: "Beef Patty",
  description: "100% grass-fed beef",
  image_url: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=300",
  calories: 250,
  protein: 26.0,
  carbs: 0.0,
  fat: 17.0,
  allergens: ["None"]
)

bun = Ingredient.create!(
  name: "Brioche Bun",
  description: "Buttery brioche bun",
  image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300",
  calories: 267,
  protein: 8.0,
  carbs: 49.0,
  fat: 4.0,
  allergens: ["Gluten", "Eggs"]
)

# Create Substitutions
Substitution.create!(
  ingredient: chicken,
  substitute_ingredient: tofu,
  price_adjustment: -2.00
)

Substitution.create!(
  ingredient: butter,
  substitute_ingredient: olive_oil,
  price_adjustment: 0.50
)

# Create Dishes
dish1 = Dish.create!(
  restaurant: restaurant1,
  name: "Butter Chicken",
  description: "Creamy tomato-based curry with tender chicken",
  base_price: 18.99
)

dish2 = Dish.create!(
  restaurant: restaurant2,
  name: "Margherita Pizza",
  description: "Classic pizza with fresh mozzarella and basil",
  base_price: 14.99
)

dish3 = Dish.create!(
  restaurant: restaurant3,
  name: "Classic Burger",
  description: "Juicy beef patty with fresh vegetables",
  base_price: 12.99
)

dish4 = Dish.create!(
  restaurant: restaurant1,
  name: "Chicken Tikka Masala",
  description: "Grilled chicken in rich tomato cream sauce",
  base_price: 19.99
)

dish5 = Dish.create!(
  restaurant: restaurant2,
  name: "Carbonara Pasta",
  description: "Creamy pasta with pancetta and parmesan",
  base_price: 16.99
)

# Create Dish Ingredients
DishIngredient.create!(
  dish: dish1,
  ingredient: chicken,
  default_quantity: 1.0,
  is_customizable: true,
  extra_cost: 3.00
)

DishIngredient.create!(
  dish: dish1,
  ingredient: butter,
  default_quantity: 0.5,
  is_customizable: true,
  extra_cost: 1.00
)

DishIngredient.create!(
  dish: dish1,
  ingredient: tomato,
  default_quantity: 2.0,
  is_customizable: false,
  extra_cost: 0.50
)

DishIngredient.create!(
  dish: dish2,
  ingredient: cheese,
  default_quantity: 1.0,
  is_customizable: true,
  extra_cost: 2.00
)

DishIngredient.create!(
  dish: dish2,
  ingredient: tomato,
  default_quantity: 3.0,
  is_customizable: true,
  extra_cost: 1.00
)

DishIngredient.create!(
  dish: dish3,
  ingredient: beef,
  default_quantity: 1.0,
  is_customizable: false,
  extra_cost: 0.00
)

DishIngredient.create!(
  dish: dish3,
  ingredient: bun,
  default_quantity: 1.0,
  is_customizable: false,
  extra_cost: 0.00
)

DishIngredient.create!(
  dish: dish3,
  ingredient: lettuce,
  default_quantity: 0.5,
  is_customizable: true,
  extra_cost: 0.50
)

DishIngredient.create!(
  dish: dish3,
  ingredient: onion,
  default_quantity: 0.5,
  is_customizable: true,
  extra_cost: 0.50
)

DishIngredient.create!(
  dish: dish3,
  ingredient: tomato,
  default_quantity: 0.5,
  is_customizable: true,
  extra_cost: 0.50
)

DishIngredient.create!(
  dish: dish4,
  ingredient: chicken,
  default_quantity: 1.0,
  is_customizable: true,
  extra_cost: 3.00
)

DishIngredient.create!(
  dish: dish5,
  ingredient: butter,
  default_quantity: 0.5,
  is_customizable: true,
  extra_cost: 1.00
)

# Create Stories
story1 = Story.create!(
  dish: dish1,
  position: 1
)

story2 = Story.create!(
  dish: dish2,
  position: 1
)

story3 = Story.create!(
  dish: dish3,
  position: 1
)

story4 = Story.create!(
  dish: dish4,
  position: 1
)

story5 = Story.create!(
  dish: dish5,
  position: 1
)

# Create Media Items for Story 1 (Butter Chicken)
media1_1 = MediaItem.create!(
  story: story1,
  media_type: :image,
  position: 1,
  duration: 5000
)

media1_2 = MediaItem.create!(
  story: story1,
  media_type: :image,
  position: 2,
  duration: 5000
)

media1_3 = MediaItem.create!(
  story: story1,
  media_type: :image,
  position: 3,
  duration: 5000
)

# Create Media Items for Story 2 (Margherita Pizza)
media2_1 = MediaItem.create!(
  story: story2,
  media_type: :image,
  position: 1,
  duration: 5000
)

media2_2 = MediaItem.create!(
  story: story2,
  media_type: :image,
  position: 2,
  duration: 5000
)

# Create Media Items for Story 3 (Classic Burger)
media3_1 = MediaItem.create!(
  story: story3,
  media_type: :image,
  position: 1,
  duration: 5000
)

media3_2 = MediaItem.create!(
  story: story3,
  media_type: :image,
  position: 2,
  duration: 5000
)

media3_3 = MediaItem.create!(
  story: story3,
  media_type: :image,
  position: 3,
  duration: 5000
)

media3_4 = MediaItem.create!(
  story: story3,
  media_type: :image,
  position: 4,
  duration: 5000
)

# Create Media Items for Story 4 (Chicken Tikka Masala)
media4_1 = MediaItem.create!(
  story: story4,
  media_type: :image,
  position: 1,
  duration: 5000
)

media4_2 = MediaItem.create!(
  story: story4,
  media_type: :image,
  position: 2,
  duration: 5000
)

# Create Media Items for Story 5 (Carbonara Pasta)
media5_1 = MediaItem.create!(
  story: story5,
  media_type: :image,
  position: 1,
  duration: 5000
)

media5_2 = MediaItem.create!(
  story: story5,
  media_type: :image,
  position: 2,
  duration: 5000
)

media5_3 = MediaItem.create!(
  story: story5,
  media_type: :image,
  position: 3,
  duration: 5000
)

# Create Hotspots
Hotspot.create!(
  media_item: media1_1,
  ingredient: chicken,
  x_position: 30.0,
  y_position: 40.0
)

Hotspot.create!(
  media_item: media1_2,
  ingredient: butter,
  x_position: 50.0,
  y_position: 50.0
)

Hotspot.create!(
  media_item: media1_3,
  ingredient: tomato,
  x_position: 70.0,
  y_position: 60.0
)

Hotspot.create!(
  media_item: media2_1,
  ingredient: cheese,
  x_position: 50.0,
  y_position: 45.0
)

Hotspot.create!(
  media_item: media2_2,
  ingredient: tomato,
  x_position: 60.0,
  y_position: 55.0
)

Hotspot.create!(
  media_item: media3_1,
  ingredient: beef,
  x_position: 50.0,
  y_position: 50.0
)

Hotspot.create!(
  media_item: media3_2,
  ingredient: bun,
  x_position: 50.0,
  y_position: 30.0
)

Hotspot.create!(
  media_item: media3_3,
  ingredient: lettuce,
  x_position: 40.0,
  y_position: 60.0
)

Hotspot.create!(
  media_item: media3_4,
  ingredient: tomato,
  x_position: 60.0,
  y_position: 60.0
)

Hotspot.create!(
  media_item: media4_1,
  ingredient: chicken,
  x_position: 45.0,
  y_position: 50.0
)

Hotspot.create!(
  media_item: media5_1,
  ingredient: butter,
  x_position: 55.0,
  y_position: 45.0
)

puts "Seed data created successfully!"
puts "Created #{Restaurant.count} restaurants"
puts "Created #{Dish.count} dishes"
puts "Created #{Ingredient.count} ingredients"
puts "Created #{Story.count} stories"
puts "Created #{MediaItem.count} media items"
puts "Created #{Hotspot.count} hotspots"
