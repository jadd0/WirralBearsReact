import React from "react";
import { LogoBanner } from "@components/layout/LogoBanner";
import { InfoBox } from "@components/layout/InfoBox";
import { CarouselComponent } from "@components/layout/Carousel";
import { MapboxMap } from "@components/layout/Mapbox";
import { BallForAllGrid } from "@components/layout/BallForAllGrid";
import { Footer } from "@components/layout/Footer";
import { Image } from "@wirralbears-monorepo/shared/types";

// TODO: use API to get images from server
const carouselImages: Image[] = [
  { id: 1, src: "https://picsum.photos/800/400?random=1", name: "1"},
  { id: 2, src: "https://picsum.photos/800/400?random=2", name: "2" },
  { id: 3, src: "https://picsum.photos/800/400?random=3", name: "3" },
  { id: 4, src: "https://picsum.photos/800/400?random=4", name: "4" },
];

export default function HomePage() {
  return (
    <div className="bg-gray-200 min-h-screen w-full font-sans">
      <LogoBanner />
      <InfoBox title="About Us">
        <p>
          We are a small club located in Woodchurch, Wirral – who have started many recent basketball careers.
          <br />
          We are an advanced club in general, yet we have groups for: Beginner, Intermediate and Advanced.
        </p>
      </InfoBox>
      <div className="container mx-auto my-8">
        <CarouselComponent images={carouselImages}/>
      </div>
      <InfoBox title="Thinking of joining?" className="mb-8">
        <p>
          Signing up is a simple process. All you have to do is show up to a session (specific to your age group) and that's it!
          <br />
          Your first session is free, but after that it is £6 per session.
          <br />
          To join, please click below to complete your joining form:
        </p>
        <div className="mt-4">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            onClick={() =>
              window.open(
                "https://docs.google.com/forms/d/1xyuIacKZlv96QKh8mAARyrk7MR2WHATB1tTouBxo0CU/viewform?edit_requested=true",
                "_blank"
              )
            }
          >
            Click Here
          </button>
        </div>
      </InfoBox>
      <h3 className="text-xl font-semibold mt-8">Our Location</h3>
      <MapboxMap />
      <InfoBox title="Ball 4 All">
        <p className="px-4">
          We have 10 policies in our club. If anyone (player or coach) wants to be involved in the youth club, they must commit to the Ball for All principles and hold everyone to account for them.
        </p>
        <BallForAllGrid />
      </InfoBox>
      <Footer />
    </div>
  );
}