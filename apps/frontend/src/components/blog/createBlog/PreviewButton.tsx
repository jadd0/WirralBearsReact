import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BlogData } from '@wirralbears/types';

interface PreviewButtonProps {
	blogData: BlogData;
	className?: string;
}

export const PreviewButton: React.FC<PreviewButtonProps> = ({
	blogData,
	className,
}) => {
	const navigate = useNavigate();

	const handlePreview = () => {
		// Store the blog data in localStorage for the preview page to access
		localStorage.setItem('blog-preview-data', JSON.stringify(blogData));
		// Navigate to the preview page
		navigate('/blog/preview');
	};

	return (
		<Button onClick={handlePreview} className={className} variant="outline">
			<Eye className="mr-2 h-4 w-4" />
			Preview
		</Button>
	);
};
