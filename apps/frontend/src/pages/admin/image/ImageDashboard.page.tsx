import AllImagesView from "@/components/image/AllImagesView";

export default function ImageDashboardPage() {
	return <>
    <AllImagesView deleteImage={true} popUpActivated={false} />
  </>;
}
