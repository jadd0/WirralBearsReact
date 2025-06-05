import { useLayoutEffect, useState } from 'react';
import { BlogEditor } from '@/components/blog/createBlog/BlogEditor';
import { BlogData } from '@wirralbears/types';
import { toast } from 'sonner';
import { api } from '@/api/api';
import { useNavigate } from 'react-router-dom';
import { useSaveCoach } from '@/hooks/coach.hooks';

export default function BlogMakerPage() {
	const [coachData, setCoachData] = useState<BlogData>({ elements: [] });
	const [initialData, setInitialData] = useState<BlogData>({ elements: [] });
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();
	const saveCoachMutation = useSaveCoach();
	const { mutate: saveCoach, isPending } = saveCoachMutation();

	// Load data from localStorage on component mount
	useLayoutEffect(() => {
		const storedData = localStorage.getItem('coach-editor-data');

		if (storedData) {
			try {
				const parsedData = JSON.parse(storedData);
				console.log({ parsedData });
				setInitialData(parsedData);
				setCoachData(parsedData);
			} catch (error) {
				console.error('Failed to parse coach editor data:', error);
				toast.error('Failed to load saved coach data');
			}
		}
	}, []);

	const handleCoachChange = (data: BlogData) => {
		setCoachData(data);
		// Save to localStorage for persistence
		localStorage.setItem('coach-editor-data', JSON.stringify(data));
	};

	// Image upload handler
	const handleImageUpload = async (file: File): Promise<string> => {
		return URL.createObjectURL(file);
	};

	// Handle save button click
	const handleSave = async (data: BlogData) => {
		setIsSubmitting(true);

		try {
			await saveCoach(data, {
				onSuccess: ({ id }: { id: any }) => {
					// Clear localStorage and navigate after successful save
					localStorage.removeItem('coach-editor-data');
					toast.success('Coach saved successfully!');
					navigate('/coaches');
				},
				onError: (error: any) => {
					toast.error('Failed to save coach', {
						description: error.message,
					});
				},
			});
		} catch (error) {
			console.error('Error saving coach:', error);
			toast.error('An unexpected error occurred');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-6 text-center">Coach Maker</h1>
			<BlogEditor
				key={JSON.stringify(initialData)}
				initialData={initialData}
				onChange={handleCoachChange}
				onImageUpload={handleImageUpload}
				onSave={handleSave}
        coach={true}
			/>
		</div>
	);
}
