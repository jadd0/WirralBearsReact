import { Calendar, User } from 'lucide-react';

interface BlogHeaderProps {
	title: string;
	author: { username: string } | null;
	createdAt: Date;
}

export default function BlogHeader({
	title,
	author,
	createdAt,
}: BlogHeaderProps) {
	// Format the date for display
	const formattedDate = new Date(createdAt).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});

	return (
		<div className="flex flex-col gap-3">
			{/* Main blog title */}
			<h1 className="text-4xl font-bold text-gray-900">{title}</h1>

			{/* Author and date information */}
			<div className="flex items-center gap-6 text-gray-600">
				{author && (
					<div className="flex items-center gap-2">
						<User size={16} />
						<span className="text-sm">{author.username}</span>
					</div>
				)}

				<div className="flex items-center gap-2">
					<Calendar size={16} />
					<span className="text-sm">{formattedDate}</span>
				</div>
			</div>
		</div>
	);
}
