"use client";

import { Product } from "@/types";
import Currency from "./ui/currency";
import Button from "./ui/Button";
import { ShoppingCart } from 'lucide-react';
import { MouseEventHandler } from "react";
import useCart from "@/hooks/use-cart";

interface InfoProps {
  data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const cart = useCart();  
  const handleAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
      event.stopPropagation()
      cart.addItem(data);
    }
  
  return (
    <div className="space-y-6">
      {/* Product Name */}
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
        {data?.name}
      </h1>

      {/* Price */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-500">Price</p>
          <p className="text-2xl font-medium text-gray-900">
            <Currency value={data?.price} />
          </p>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Product Details */}
      <div className="space-y-4">
        {/* Size */}
        <div className="flex items-center gap-x-4">
          <h3 className="w-20 font-medium text-gray-900">Size:</h3>
          <div className="text-gray-700 bg-gray-100 px-3 py-1 rounded-md">
            {data?.size?.name}
          </div>
        </div>

        {/* Color */}
        <div className="flex items-center gap-x-4">
          <h3 className="w-20 font-medium text-gray-900">Color:</h3>
          <div className="flex items-center gap-2">
            <div 
              className="h-6 w-6 rounded-full border border-gray-300 shadow-sm"
              style={{ backgroundColor: data?.color?.value }}
            />
            <span className="text-gray-700">{data?.color?.name}</span>
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="pt-4">
        <Button
          onClick={handleAddToCart} 
          className="w-full sm:w-auto flex items-center justify-center gap-x-2 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors">
          Add To Cart
          <ShoppingCart className="w-5 h-5"/>
        </Button>
      </div>
    </div>
  );
};

export default Info;
