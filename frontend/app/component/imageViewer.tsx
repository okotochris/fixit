// ImageViewer.tsx
type Props = {
  image: string | null;
  onClose: () => void;
};

export function ImageViewer({ image, onClose }: Props) {
  if (!image) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <img
        src={image}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl"
        alt="Preview"
      />
    </div>
  );
}