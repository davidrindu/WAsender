import React from "react";

interface BlankPageProps {
  title?: string;
}

const BlankPage: React.FC<BlankPageProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-700">
          {title || "Blank Page"}
        </h1>
        <p className="mt-2 text-gray-500">This page is under construction</p>
      </div>
    </div>
  );
};

export default BlankPage;
