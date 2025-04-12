import Image from "next/image";
import { Button } from "@/components/ui/button";
import HeroImg from "@/assets/hero-section-img.webp";
import HealthMonitoringImg from "@/assets/HealthMonitoringImg.jpg";
import GovernmentSchemesImg from "@/assets/GovernmentSchemesImg.jpg";
import SelfHelpGroupsImg from "@/assets/SelfHelpGroupsImg.jpg";
import HealthServicesImg from "@/assets/HealthServicesImg.jpg";
import DigitalPortalImg from "@/assets/DigitalPortalImg.jpg";
import DataDrivenImg from "@/assets/DataDrivenImg.jpg";
import Icon from "@/assets/favicon/android-chrome-512x512.png";
import {
  ChartNetwork,
  HandHeart,
  Handshake,
  HeartPulse,
  ScrollText,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
const features = [
  {
    id: 1,
    icon: HeartPulse,
    iconColor: "text-red-300",
    bgImage: HealthMonitoringImg, // Replace with your actual image path
    title: "Health Monitoring",
    description:
      "Track health, nutrition, and socio-economic status in tea garden communities, focusing on children and women.",
  },
  {
    id: 2,
    icon: ScrollText,
    iconColor: "text-amber-300",
    bgImage: GovernmentSchemesImg, // Replace with your actual image path
    title: "Government Schemes",
    description:
      "Check enrollment in government schemes like Swasthya Sathi, SC/ST Card, and other welfare programs.",
  },
  {
    id: 3,
    icon: Handshake,
    iconColor: "text-cyan-300",
    bgImage: SelfHelpGroupsImg, // Replace with your actual image path
    title: "Self-Help Groups",
    description:
      "Collect data on Self-Help Groups (SHG), training, and credit linkage to empower communities.",
  },
  {
    id: 4,
    icon: Stethoscope,
    iconColor: "text-green-300",
    bgImage: HealthServicesImg, // Replace with your actual image path
    title: "Health Services",
    description:
      "Identify gaps in health services and social welfare coverage to improve public service delivery.",
  },
  {
    id: 5,
    icon: HandHeart,
    iconColor: "text-violet-400",
    bgImage: DigitalPortalImg, // Replace with your actual image path
    title: "Digital Portal",
    description:
      "Create a digital portal for better planning, targeted interventions, and data-driven decision-making.",
  },
  {
    id: 6,
    icon: ChartNetwork,
    iconColor: "text-teal-300",
    bgImage: DataDrivenImg, // Replace with your actual image path
    title: "Data-Driven Insights",
    description:
      "Enable data-driven decision-making for government and NGOs to improve health outcomes.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-300 text-gray-800">
      {/* Header Section */}
      <header className="w-full bg-green-700 text-white py-6">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold flex justify-center items-center gap-1">
            <Image src={Icon} alt="logo" width={40} height={40} className="" />{" "}
            Tea Garden Survey.
          </h1>
          <nav className="flex gap-4">
            <a href="#features" className="hover:underline">
              Features
            </a>
            <a href="#about" className="hover:underline">
              About
            </a>
            <a href="#contact" className="hover:underline">
              Contact
            </a>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center text-white">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={HeroImg} // Replace with your actual image path
            alt="Tea Garden Background"
            layout="fill"
            objectFit="cover"
            className="z-0"
          />
          <div className="absolute inset-0 bg-black/55 bg-opacity-50"></div>
        </div>

        {/* Content in Front of Background */}
        <div className="relative z-10 max-w-3xl px-6">
          <h2 className="text-4xl font-bold mb-4">
            Empowering Tea Garden Communities
          </h2>
          <p className="text-lg mb-6">
            A modern solution to survey and analyze tea garden households and
            welfare programs.
          </p>
          <div className="flex justify-center gap-4">
            <a
              as="a"
              href="#features"
              className="cursor-pointer p-[1.9px] px-2 flex justify-center text-center items-center rounded-md bg-green-700 hover:bg-green-800 text-white"
            >
              Learn More
            </a>
            <Button
              as="a"
              className="cursor-pointer bg-transparent p-0 border-2 border-white text-white hover:bg-white hover:text-green-700 transition duration-300"
            >
              <Link className="m-0 p-2" href="/login">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white cursor-default">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="relative p-10 px-0 h-[200px] rounded-lg group shadow-md overflow-hidden bg-gradient-to-t from-black to-black/50 "
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={feature.bgImage}
                    alt={feature.title}
                    layout="fill"
                    objectFit="cover"
                    className="opacity-50 blur-[1.5px] group-hover:blur-none group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition duration-700"
                  />
                </div>

                {/* Content */}
                <div className="absolute z-10 px-10 pt-5 group-hover:pt-0 text-center bg-gradient-to-t group-hover:from-black/90 from-black to-transparent text-white mt-auto flex flex-col items-center bottom-0">
                  <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <feature.icon className={feature.iconColor} />
                    {feature.title}
                  </h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-green-100 py-16">
        <div className="container mx-auto md:px-[15%] text-center">
          <h2 className="text-3xl font-bold mb-6">About Us</h2>
          <p className="text-lg text-justify">
            The Tea Garden Survey in West Bengal aims to systematically track
            the health, nutrition, and socio-economic conditions of tea garden
            communities. A key focus of this initiative is on children aged 0–5
            years, particularly identifying cases of Severe Acute Malnutrition
            (SAM) and Moderate Acute Malnutrition (MAM), as well as monitoring
            instances of low birth weight. Ensuring the well-being of young
            children is crucial for improving overall community health.
            <br />
            <br />
            Additionally, the survey prioritizes women&apos;s health, with a special
            emphasis on pregnant and lactating mothers. Comprehensive data
            collection will include blood pressure (BP), sugar levels, and other
            prevalent health conditions affecting household members. By
            assessing these health indicators, the project aims to identify
            risks early and ensure timely medical intervention.
            <br />
            <br />
            Another important aspect of the survey is to evaluate the enrollment
            of tea garden workers in government welfare schemes, such as
            Swasthya Sathi and SC/ST Cards. Understanding coverage gaps in these
            schemes will help policymakers design better strategies to improve
            accessibility and effectiveness. The initiative will also gather
            data on Self-Help Groups (SHGs), their participation in training
            programs, and their credit linkages, which are crucial for economic
            empowerment and financial inclusion.
            <br />
            <br />
            Through this data-driven approach, the survey aims to identify gaps
            in health services and social welfare coverage, enabling targeted
            interventions. A digital portal will be developed to streamline data
            collection, analysis, and reporting, thereby enhancing public
            service delivery. This initiative will empower the government and
            NGOs to make informed, data-backed decisions, ultimately leading to
            better health outcomes and socio-economic improvements for tea
            garden communities.
            <br />
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
          <p className="mb-6">
            Have questions or want to get started? Reach out to us today!
          </p>
          <Button as="a" href="mailto:contact@teagardensurvey.com">
            Email Us
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-700 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Tea Garden Survey. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
