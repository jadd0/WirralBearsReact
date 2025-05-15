// components/blog/ImageUpload.tsx
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { type DropzoneOptions } from 'react-dropzone';
import { FileUploader, FileInput } from '@/components/ui/file-upload';
import { Trash2, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClassNameValue } from 'tailwind-merge';
import { IMAGE_UPLOAD_CONFIG } from '@wirralbears/constants';

type ImageUploadContext = {
  image: File | null;
  setImage: (file: File | null) => void;
  imagePreviewUrl: string | null;
};

type ImageUploadProviderProps = {
  children?: React.ReactNode;
  image: File | null;
  setImage: (file: File | null) => void;
};

const ImageUploadContext = React.createContext<ImageUploadContext>({
  image: null,
  setImage: () => {},
  imagePreviewUrl: null,
});

const ImageUploadProvider = ({
  children,
  image,
  setImage,
}: ImageUploadProviderProps) => {
  const imagePreviewUrl = useMemo(() => {
    if (!image) return null;
    return URL.createObjectURL(image);
  }, [image]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  return (
    <ImageUploadContext.Provider value={{ image, setImage, imagePreviewUrl }}>
      {children}
    </ImageUploadContext.Provider>
  );
};

const useImageUpload = () => useContext(ImageUploadContext);

const FileUploadImagePlaceholder = ({
  className,
}: {
  className?: ClassNameValue;
}) => {
  const { image, setImage } = useImageUpload();

  return (
    <FileUploader
      value={image ? [image] : []}
      onValueChange={(files) => files && files.length > 0 ? setImage(files[0]) : setImage(null)}
      dropzoneOptions={IMAGE_UPLOAD_CONFIG as DropzoneOptions}
      className={cn('w-full h-full p-0.5 aspect-square', className)}
    >
      <FileInput className="w-full h-full overflow-hidden flex flex-col items-center justify-center border-dashed border-2">
        <div className="w-full h-full rounded-xl flex flex-col gap-2 items-center justify-center">
          <ImagePlus className="text-gray-500 w-10 h-10" />
          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span>
          </p>
        </div>
      </FileInput>
    </FileUploader>
  );
};

const DeleteButton = ({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: ClassNameValue;
}) => {
  return (
    <button type="button" onClick={onClick}>
      <Trash2
        className={cn(
          'bg-background/80 rounded-full p-1 hover:stroke-destructive cursor-pointer',
          className
        )}
      />
    </button>
  );
};

const ImagePreview = ({ className }: { className?: ClassNameValue }) => {
  const { imagePreviewUrl, setImage } = useImageUpload();

  const handleDeleteImage = useCallback(() => {
    setImage(null);
  }, [setImage]);

  if (!imagePreviewUrl) {
    return <FileUploadImagePlaceholder className={className} />;
  }

  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      <img
        src={imagePreviewUrl}
        alt="Preview"
        className="min-w-full min-h-full object-cover rounded-lg"
      />
      <DeleteButton
        onClick={handleDeleteImage}
        className="right-2 top-2 size-8 absolute"
      />
    </div>
  );
};

export function ImageUploadAndPreview({
  setImage,
  image,
  onImageUpload,
  className,
}: {
  setImage: (file: File | null) => void;
  image: File | null;
  onImageUpload?: (url: string) => void;
  className?: ClassNameValue;
}) {
  return (
    <ImageUploadProvider image={image} setImage={setImage}>
      <div className={cn('w-full aspect-square', className)}>
        <ImagePreview />
      </div>
    </ImageUploadProvider>
  );
}
