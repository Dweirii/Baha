"use client";

import usePreviewModal from "@/hooks/use-preview-modal";
import Modal from "./ui/modal";
import Gallery from "./gallery";
import Info from "./info";

const PreviewModal = () => {
  const previewModal = usePreviewModal();
  const product = usePreviewModal((state) => state.data);

  if (!product) {
    return null;
  }

  return (
    <Modal open={previewModal.isOpen} onClose={previewModal.onClose}>

      <div className="grid w-full grid-cols-4 items-start gap-x-8 gap-y-10 sm:grid-cols-12 lg:gap-x-10">
        {/* GALLERY COLUMN */}
        <div className="sm:col-span-2 lg:col-span-5 ">
          <Gallery images={product.images} />
        </div>

        {/* INFO COLUMN */}
        <div className="sm:col-span-4 lg:col-span-7 mt-3">
          <Info data={product} />
        </div>
      </div>
    </Modal>
  );
};

export default PreviewModal;
