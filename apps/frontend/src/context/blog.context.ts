import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	useMemo,
} from 'react';
import { BlogData, BlogElement } from '@wirralbears/types';
import { BLOG } from '@wirralbears/validation';
import { toast } from 'sonner';

// Define the context type
type BlogContextType = {
	elements: BlogElement[];
	setElements: React.Dispatch<React.SetStateAction<BlogElement[]>>;
	addElement: (type: ElementType) => void;
	updateElement: (id: string, updates: Partial<BlogElement>) => void;
	deleteElement: (id: string) => void;
	validateAndNotify: (blogElements: BlogElement[]) => BlogData | null;
	files: File[];
	setFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

// Create the context with default values
const BlogContext = createContext<BlogContextType | undefined>(undefined);

// Create a provider component
export const BlogProvider = ({
	children,
	initialData,
	onChange,
}: {
	children: React.ReactNode;
	initialData?: BlogData;
	onChange?: (data: BlogData) => void;
}) => {
	// Initialize elements state
	const [elements, setElements] = useState<BlogElement[]>(() => {
		if (initialData?.elements && initialData.elements.length > 0) {
			const hasTitle = initialData.elements.some(
				(el) => el.type === 'heading' && el.position === 0
			);

			if (hasTitle) {
				return initialData.elements;
			}

			return [createNewElement('heading', 0), ...initialData.elements];
		}

		return [createNewElement('heading', 0)];
	});

	// State for files (images) that will be uploaded on form submission
	const [files, setFiles] = useState<File[]>([]);

	// Add a new element
	const addElement = useCallback(
		(type: ElementType) => {
			const position = elements.length;
			const newElement = createNewElement(type, position);
			const newElements = [...elements, newElement];
			setElements(newElements);
		},
		[elements]
	);

	// Update an existing element
	const updateElement = useCallback(
		(id: string, updates: Partial<BlogElement>) => {
			setElements((prevElements) =>
				prevElements.map((element) =>
					element.id === id ? { ...element, ...updates } : element
				)
			);
		},
		[]
	);

	// Delete an element
	const deleteElement = useCallback(
		(id: string) => {
			// Find the element to be deleted
			const elementToDelete = elements.find((el) => el.id === id);

			// Don't allow deleting the title element (position 0)
			if (elementToDelete?.position === 0) {
				toast.error('Cannot delete title', {
					description: 'The blog title is required and cannot be removed',
				});
				return;
			}

			const newElements = elements.filter((element) => element.id !== id);

			// Update positions after deletion
			const updatedElements = newElements.map((el, idx) => ({
				...el,
				position: idx,
			}));

			setElements(updatedElements);
		},
		[elements]
	);

	// Validate blog data and notify parent component
	const validateAndNotify = useCallback(
		(blogElements: BlogElement[]) => {
			try {
				const blogData: BlogData = { elements: blogElements };
				const result = BLOG.blogDataSchema.parse(blogData);

				if (onChange) {
					onChange(result);
				}

				return result;
			} catch (error: any) {
				if (error.errors) {
					const errorMessages = error.errors
						.map((err: any) => err.message)
						.join('\n');
					toast.error('Validation Error', {
						description: errorMessages,
					});
				}
				return null;
			}
		},
		[onChange]
	);

	// Create the context value object
	const contextValue = useMemo(
		() => ({
			elements,
			setElements,
			addElement,
			updateElement,
			deleteElement,
			validateAndNotify,
			files,
			setFiles,
		}),
		[
			elements,
			setElements,
			addElement,
			updateElement,
			deleteElement,
			validateAndNotify,
			files,
			setFiles,
		]
	);

	return (
		<BlogContext.Provider value={contextValue}>{children}</BlogContext.Provider>
	);
};

// Custom hook to use the blog context
export const useBlogContext = () => {
	const context = useContext(BlogContext);
	if (context === undefined) {
		throw new Error('useBlogContext must be used within a BlogProvider');
	}
	return context;
};

// Helper function to create new elements
function createNewElement(type: ElementType, position: number): BlogElement {
	const id = uuidv4();

	switch (type) {
		case 'heading':
			return { id, type, text: '', position };
		case 'paragraph':
			return { id, type, text: '', position };
		case 'image':
			return { id, type, url: '', alt: '', position };
		default:
			throw new Error(`Unknown element type: ${type}`);
	}
}
