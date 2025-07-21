import React from 'react';
import { FileText, Users, GraduationCap, Scale } from 'lucide-react';

const UseCases: React.FC = () => {
  const useCases = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Freelancers",
      description: "Sending invoices and contracts to clients"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "HR Teams",
      description: "Collecting e-signatures for employee documents"
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Students",
      description: "Submitting signed assignments and forms"
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Legal Professionals",
      description: "Document signing and verification processes"
    }
  ];

  return (
    <section id="use-cases" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Who Is It For?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Perfect for anyone who needs quick, professional digital signatures.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                {useCase.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {useCase.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;