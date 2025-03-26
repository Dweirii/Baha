import Image from "next/image";
import { Billboard as BillboardType } from "@/types";

interface BillboardProps {
  data: BillboardType;
}

const Billboard: React.FC<BillboardProps> = ({
  data
}) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 rounded-xl overflow-hidden">
      <div className="rounded-xl relative aspect-square md:aspect-[2.4/1] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={data?.imageUrl || "/placeholder.svg"}
            alt={data?.label || "Billboard"}
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          
          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50" />
        </div>
        
        {/* Content */}
        <div className="relative h-full w-full flex flex-col justify-center items-center text-center p-6 sm:p-10">
          <div className="animate-fade-in-up">
            <h2 className="font-bold text-3xl sm:text-5xl lg:text-6xl max-w-xs sm:max-w-xl text-Black drop-shadow-md">
              {data?.label || ""}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billboard;
