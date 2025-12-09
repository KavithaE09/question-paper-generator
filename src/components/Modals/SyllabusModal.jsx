import { X, BookOpen } from 'lucide-react';
import PropTypes from 'prop-types';

export default function SyllabusModal({ examType, onClose }) {
  const getSyllabusContent = () => {
    switch (examType) {
      case 'CAT1':
        return {
          title: 'Continuous Assessment Test - I',
          units: ['UNIT I', 'UNIT II', 'UNIT III (First Half)'],
          description: 'CAT 1 covers Units 1, 2, and the first half of Unit 3',
        };
      case 'CAT2':
        return {
          title: 'Continuous Assessment Test - II',
          units: ['UNIT III (Second Half)', 'UNIT IV', 'UNIT V'],
          description: 'CAT 2 covers the second half of Unit 3, Unit 4, and Unit 5',
        };
      case 'SEMESTER':
        return {
          title: 'Semester Examination',
          units: ['UNIT I', 'UNIT II', 'UNIT III', 'UNIT IV', 'UNIT V'],
          description: 'Semester exam covers the complete syllabus (All Units)',
        };
      default:
        return {
          title: 'Syllabus',
          units: [],
          description: 'No syllabus information available',
        };
    }
  };

  const syllabus = getSyllabusContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center">
            <BookOpen className="w-6 h-6 mr-3" />
            <h2 className="text-2xl font-bold">Syllabus</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{syllabus.title}</h3>
            <p className="text-gray-600">{syllabus.description}</p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 text-lg">Units Covered:</h4>
            <div className="grid gap-3">
              {syllabus.units.map((unit, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 p-4 rounded"
                >
                  <div className="flex items-center">
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-gray-800">{unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">Note:</span> Please ensure questions are selected from the appropriate units based on the exam type.
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

SyllabusModal.propTypes = {
  examType: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
