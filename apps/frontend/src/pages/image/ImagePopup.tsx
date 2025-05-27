import { Image } from '@wirralbears/backend-types';

interface ImagePopupProps {
  image: Image;
  onClose: () => void;
}

export default function ImagePopup({ image, onClose }: ImagePopupProps) {
  const handleParentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      console.log("Clicked outside the image, closing popup");
      onClose();
    }
  }

   return (
    <div className='min-w-full min-h-full absolute bg-black top-0' onClick={handleParentClick}>

    </div>
   ) 
}