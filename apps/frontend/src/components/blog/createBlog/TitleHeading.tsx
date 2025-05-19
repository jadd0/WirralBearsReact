import { useState } from "react";
import { BLOG_MAX_TITLE_LENGTH } from "../../../../../../packages/constants/src/blog.constants";
import { Input } from "@/components/ui/input";
import { HeadingElement } from "../../../../../../packages/types/src/blog.types";

/**
 * TitleHeading component for the mandatory blog title
 */
interface TitleHeadingProps {
	title: string;
	onChange: (title: string) => void;
}
/**
* TitleHeadingElement component for the mandatory blog title
* This will be added as the first element in the blog elements array
*/
export const TitleHeadingElement = ({
 element,
 onChange,
}: {
 element: HeadingElement;
 onChange: (id: string, text: string) => void;
}) => {
 const [error, setError] = useState<string | null>(null);

 // Handle title input changes
 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const value = e.target.value;
   if (value.length > BLOG_MAX_TITLE_LENGTH) {
     setError(`Title must be ${BLOG_MAX_TITLE_LENGTH} characters or less`);
   } else {
     setError(null);
     onChange(element.id, value);
   }
 };

 return (
   <div className="mb-6 border-b pb-4">
     <h2 className="text-lg font-semibold mb-2">Blog Title (Required)</h2>
     <div className="space-y-2">
       <Input
         className="text-2xl font-bold"
         value={element.text}
         onChange={handleChange}
         placeholder="Enter your blog title"
         maxLength={BLOG_MAX_TITLE_LENGTH}
         required
       />
       {error && <p className="text-sm text-red-500">{error}</p>}
       <p className="text-xs text-gray-400">
         {element.text.length}/{BLOG_MAX_TITLE_LENGTH}
       </p>
     </div>
   </div>
 );
};