require "test_helper"

class DishIngredientsControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get dish_ingredients_new_url
    assert_response :success
  end

  test "should get create" do
    get dish_ingredients_create_url
    assert_response :success
  end

  test "should get edit" do
    get dish_ingredients_edit_url
    assert_response :success
  end

  test "should get update" do
    get dish_ingredients_update_url
    assert_response :success
  end

  test "should get destroy" do
    get dish_ingredients_destroy_url
    assert_response :success
  end
end
