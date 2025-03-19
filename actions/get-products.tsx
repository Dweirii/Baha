import qs from "query-string";

import { Product } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

interface Query {
    categoryId?: string;
    colorId?: string;
    sizeId?: string;
    isFeatured?: boolean
}

const getProduct = async (query: Query): Promise<Product[]> => {
    const url = qs.stringifyUrl({
        url: URL,
        query: {
            categoryId: query.categoryId,
            colorId: query.colorId,
            sizeId: query.sizeId,
            isFeatured: query.isFeatured,
        },
    });

    const res = await fetch(url);
    const data = await res.json();


    const processedData = data.map((product: any) => ({
        ...product,
        images: product.image?.map((img: any) => img.url) || [], 
    }));


    return processedData;
};

export default getProduct;