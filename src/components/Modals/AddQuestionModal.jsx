import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

/* Plain JavaScript version of AddQuestionModal */

export default function AddQuestionModal({ courseCode, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    unit: '',
    marks: '',
    topic: '',
    questionText: '',
    kc: '',
    courseOutcome: '',
    performanceIndicator: '',
    hasDiagram: false,
  });

  const [piOptions, setPiOptions] = useState([]);

  // Topics per unit (adjust based on actual topics in your course)
  const topicsPerUnit = {
    '1': 6,
    '2': 6,
    '3': 6,
    '4': 6,
    '5': 6,
  };

  useEffect(() => {
    const unitNum = formData.unit;
    if (!unitNum) {
      setPiOptions([]);
      setFormData(prev => ({ ...prev, performanceIndicator: '' }));
      return;
    }

    const topicCount = topicsPerUnit[unitNum] || 6;
    const options = [];

    for (let i = 1; i <= topicCount; i++) {
      options.push(`${unitNum}.1.${i}`);
    }

    setPiOptions(options);
    // Reset PI if current selection is no longer valid
    setFormData(prev => ({
      ...prev,
      performanceIndicator: options.includes(prev.performanceIndicator) ? prev.performanceIndicator : '',
    }));
  }, [formData.unit]);

  const handleChange = (e) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, courseCode }),
      });

      if (response.ok) {
        if (typeof onSubmit === 'function') onSubmit();
        if (typeof onClose === 'function') onClose();
      } else {
        console.error('Failed to add question, status:', response.status);
      }
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-3xl bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Add Questions</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Unit, Marks, and Topic Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Unit</option>
                <option value="1">UNIT I</option>
                <option value="2">UNIT II</option>
                <option value="3">UNIT III</option>
                <option value="4">UNIT IV</option>
                <option value="5">UNIT V</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marks</label>
              <select
                name="marks"
                value={formData.marks}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Marks</option>
                <option value="2">2 Mark</option>
                <option value="6">6 Mark</option>
                <option value="7">7 Mark</option>
                <option value="10">10 Mark</option>
                <option value="13">13 Mark</option>
                <option value="15">15 Mark</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
              <select
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Topic</option>
                <option value="T1">T1</option>
                <option value="T2">T2</option>
                <option value="T3">T3</option>
                <option value="T4">T4</option>
                <option value="T5">T5</option>
                <option value="T6">T6</option>
              </select>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
            <textarea
              name="questionText"
              value={formData.questionText}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the question"
              required
            />
          </div>

          {/* Upload Diagram */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">Upload Diagram (Optional)</p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="diagram-upload"
            />
            <label
              htmlFor="diagram-upload"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700"
            >
              Choose File
            </label>
          </div>

          {/* KC, CO, and PI Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">KC (Knowledge Category)</label>
              <select
                name="kc"
                value={formData.kc}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select KC</option>
                <option value="C">C (Conceptual)</option>
                <option value="P">P (Procedural)</option>
                <option value="F">F (Factual)</option>
                <option value="MC">MC (Metacognitive)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Outcome</label>
              <select
                name="courseOutcome"
                value={formData.courseOutcome}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select CO</option>
                <option value="CO1">CO1</option>
                <option value="CO2">CO2</option>
                <option value="CO3">CO3</option>
                <option value="CO4">CO4</option>
                <option value="CO5">CO5</option>
                <option value="CO6">CO6</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Performance Indicator (PI)</label>
              <select
                name="performanceIndicator"
                value={formData.performanceIndicator}
                onChange={handleChange}
                disabled={!formData.unit}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
                <option value="">Select PI</option>
                {piOptions.map((pi) => (
                  <option key={pi} value={pi}>
                    {pi}
                  </option>
                ))}
              </select>
              {!formData.unit && (
                <p className="mt-1 text-xs text-gray-500">Select a unit first</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}