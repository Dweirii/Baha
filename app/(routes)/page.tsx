import getBillboards from "@/actions/get-billboards";
import getProduct from "@/actions/get-products";
import Billboard from "@/components/billboard";
import ProductList from "@/components/product-list";
import Container from "@/components/ui/container";

export const revalidate = 0;

const HomePage = async () => {
    try {
        const products = await getProduct({isFeatured: true});
        const billboard = await getBillboards("2a72e929-7b27-445d-bfe5-be5d2da6a22e");
        if (!billboard) {
            return <p>No billboard found.</p>;
        }

        return (
            <Container>
                <div className="space-y-10 pb-10">
                    <Billboard data={billboard} />
                </div>
                <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
                    <ProductList 
                        title="Featured Products"
                        items={products}
                    />
                </div>
            </Container>
        );
    } catch (error) {
        console.error("Error fetching billboard:", error);
        return <p>Failed to load billboard.</p>;
    }
};

export default HomePage;
