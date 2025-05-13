import { LogoBanner } from "@components/layout/LogoBanner";
import { InfoBox } from "@components/layout/InfoBox";
import { Footer } from "@components/layout/Footer";

export default function SponsorshipPage() {
  return (
    <div className="bg-gray-200 min-h-screen font-sans">
      <LogoBanner />
      <h1 className="text-2xl font-bold my-4">Our Sponsors</h1>
      <p className="text-black px-8 md:px-32 mb-6">
        We would like to say a special thank you to Taylor Brown Solicitors and Chester Financial Wealth Management Ltd. for sponsoring our club. Without them our club would be nowhere near its position today.
      </p>
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 sponsorsDiv">
        <a href="https://taylorbrownsolicitors.com" className="w-2/3 md:w-1/3 flex justify-center">
          <img src="/images/taylor Brown 1.png" alt="Taylor Brown Solicitors" className="tb" />
        </a>
        <a href="https://www.chesterfinancial.co.uk" className="w-2/3 md:w-1/3 flex justify-center">
          <img src="/images/Chester Financial.png" alt="Chester Financial" className="cf" />
        </a>
      </div>
      <InfoBox title="Donate" className="mt-8">
        <p>
          The Wirral Bears Basketball Club are a non-profit organisation - yet money allows us to carry on. Below, there is an option to donate via PayPal, which if you feel inclined, would help the club out greatly. Every pound donated goes towards the club to buy balls, kits etc. Thank you.
        </p>
        <form
          action="https://www.paypal.com/donate"
          method="post"
          target="_top"
          className="mt-4"
        >
          <input type="hidden" name="hosted_button_id" value="X7RBJZ2S884D8" />
          <input
            type="image"
            src="https://www.paypalobjects.com/en_GB/i/btn/btn_donate_LG.gif"
            border="0"
            name="submit"
            title="PayPal - The safer, easier way to pay online!"
            alt="Donate with PayPal button"
          />
          <img
            alt=""
            border="0"
            src="https://www.paypal.com/en_GB/i/scr/pixel.gif"
            width="1"
            height="1"
          />
        </form>
      </InfoBox>
      <Footer />
    </div>
  );
}
