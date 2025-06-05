import { useLayoutEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { BlogEditor } from '@/components/blog/createBlog/BlogEditor';
import { BlogData } from '@wirralbears/types';
import { FullBlog } from '@wirralbears/backend-types';
import { toast } from 'sonner';
import { useGetCoach, useEditCoach } from '@/hooks/coach.hooks';
import { convertFullBlogToBlogData } from '@/lib/editorUtils';

export function CoachEdit() {
	const location = useLocation();
	const { id } = useParams();
	const navigate = useNavigate();
	const [coachData, setCoachData] = useState<BlogData>({ elements: [] });
	const [initialData, setInitialData] = useState<BlogData>({ elements: [] });
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { data: fetchedCoach, isLoading } = useGetCoach(id ?? '');
	const editCoachMutation = useEditCoach()();
	const { mutate: editCoach, isPending } = editCoachMutation;

	useLayoutEffect(() => {
		if (location.state?.coachData) {
			const passedData = location.state.coachData as BlogData;
			setInitialData(passedData);
			setCoachData(passedData);
		} else if (fetchedCoach && !isLoading) {
			const convertedData = convertFullBlogToBlogData(fetchedCoach as FullBlog);
			setInitialData(convertedData);
			setCoachData(convertedData);
		}
	}, [location.state, fetchedCoach, isLoading]);

	const handleCoachChange = (data: BlogData) => {
		setCoachData(data);
		localStorage.setItem(`coach-editor-data-${id}`, JSON.stringify(data));
	};

	const handleImageUpload = async (file: File): Promise<string> => {
		return URL.createObjectURL(file);
	};

	const handleSave = async (data: BlogData) => {
		setIsSubmitting(true);
		try {
			await editCoach(
				{ coachData: data, id: id! },
				{
					onSuccess: () => {
						localStorage.removeItem(`coach-editor-data-${id}`);
						toast.success('Coach profile updated successfully!');
						navigate(`/coach/${id}`);
					},
					onError: (error: any) => {
						toast.error('Failed to update coach profile', {
							description: error.message,
						});
					},
				}
			);
		} catch (error) {
			console.error('Error updating coach:', error);
			toast.error('An unexpected error occurred');
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="container mx-auto py-8 text-center">
				Loading coach data...
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-6 text-center">
				Edit Coach Profile
			</h1>
			<BlogEditor
				key={JSON.stringify(initialData)}
				initialData={initialData}
				onChange={handleCoachChange}
				onImageUpload={handleImageUpload}
				onSave={handleSave}
			/>
		</div>
	);
}
