import { useMe } from '@/hooks/auth.hooks';

export default function AdminPage() {
	const { data, isPending } = useMe();

	return (
		<>
			{/* {!isPending && (
				<>
					<h1>Admin Page</h1>
					<h2>Welcome, {data?.user}</h2>
				</>
			)} */}
			<h1>hekki</h1>
		</>
	);
}
