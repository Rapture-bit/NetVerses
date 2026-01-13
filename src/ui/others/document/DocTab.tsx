import React from "react";

const DocTab = ({ title, subtitles, descriptions, sections }) => {
  return (
    <div className="w-full flex flex-col items-center text-center px-4 md:px-6 lg:px-8 py-12">
      <div className="flex flex-col items-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
          {title}
        </h1>

        {subtitles &&
          subtitles.map((subtitle, index) => (
            <h2
              key={index}
              className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4"
            >
              {subtitle}
            </h2>
          ))}

        {descriptions &&
          descriptions.map((description, index) => (
            <p
              key={index}
              className="text-base md:text-lg lg:text-xl leading-relaxed"
            >
              {description}
            </p>
          ))}

        {sections &&
          sections.map((section, index) => (
            <div key={index} className="my-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">
                {section.title}
              </h2>
              {section.content.map((item, idx) => (
                <p
                  key={idx}
                  className="text-base md:text-lg lg:text-xl leading-relaxed"
                >
                  {item}
                </p>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default DocTab;
