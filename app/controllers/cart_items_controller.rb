class CartItemsController < ApplicationController
  def index
    @cart_items = CartItem.for_session(session.id.to_s).includes(:dish)
  end

  def create
    @cart_item = CartItem.new(
      session_id: session.id.to_s,
      dish_id: params[:dish_id],
      customizations: params[:customizations] || {},
      quantity: params[:quantity] || 1
    )

    if @cart_item.save
      render json: { success: true, cart_item: @cart_item, count: cart_count }
    else
      render json: { success: false, errors: @cart_item.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @cart_item = CartItem.find(params[:id])
    @cart_item.destroy
    render json: { success: true, count: cart_count }
  end

  def clear
    CartItem.for_session(session.id.to_s).destroy_all
    render json: { success: true, count: 0 }
  end

  def count
    render json: { count: cart_count }
  end

  private

  def cart_count
    CartItem.for_session(session.id.to_s).sum(:quantity)
  end
end

