"use client"; 
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Form from "@/components/Form";
import { generateRoadmap } from "@/lib/data/generateRoadmap";
import { validateForm } from "@/lib/data/validateForm";
import RoadmapResult from "@/components/RoadmapResult";

export default function RoadmapPage() {
  const [generatedRoadmap, setGeneratedRoadmap] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<any>(null);

  const handleSubmit = (formData: any) => {
    const errors = validateForm(formData);
    setFormErrors(errors);

    if (!Object.values(errors).some((error: string) => error !== "")) {
      const roadmap = generateRoadmap(formData);
      setGeneratedRoadmap(roadmap);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Form Section */}
          <Form onSubmit={handleSubmit} />

          {/* Display Generated Roadmap */}
          {generatedRoadmap && <RoadmapResult roadmap={generatedRoadmap} />}
        </div>
      </main>
      <Footer />
    </div>
  );
}
