import React from 'react';
import { BlogData, BlogElement } from '@wirralbears/types';

interface BlogPreviewProps {
	data: BlogData;
}

export const BlogPreview: React.FC<BlogPreviewProps> = ({ data }) => {
	if (!data || !data.elements || data.elements.length === 0) {
		return (
			<div className="max-w-4xl mx-auto p-8 text-center">
				<h1 className="text-2xl font-bold mb-4">Empty Blog</h1>
				<p className="text-gray-500">This blog doesn't have any content yet.</p>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto p-8">
			{data.elements.map((element, index) => (
				<RenderElement key={element.id || index} element={element} />
			))}
		</div>
	);
};

const RenderElement: React.FC<{ element: BlogElement }> = ({ element }) => {
	switch (element.type) {
		case 'heading':
			return <h2 className="text-3xl font-bold mb-4 mt-8">{element.text}</h2>;
		case 'paragraph':
			return <p className="mb-4 leading-relaxed">{element.text}</p>;
		case 'image':
			return (
				<div className="my-6">
					<img
						src={element.url}
						alt={element.alt}
						className="max-w-full rounded-lg mx-auto"
					/>
					{element.alt && (
						<p className="text-sm text-center text-gray-500 mt-2">
							{element.alt}
						</p>
					)}
				</div>
			);
		default:
			return null;
	}
};
