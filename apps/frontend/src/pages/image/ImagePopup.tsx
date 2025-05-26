import { Image } from '@wirralbears/backend-types';

interface ImagePopupProps {
  image: Image;
  onClose: () => void;
}

export default function ImagePopup({ image, onClose }) {
   return (
    <div className='min-w-full min-h-full absolute bg-black'></div>
   ) 
}