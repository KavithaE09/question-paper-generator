export default function TemplateHeader({ paperDetails }) {
  return (
    <div className="border-2 border-gray-300 p-6 rounded-lg bg-gray-50">
      <div className="flex justify-between items-start mb-4">
        <div className="text-left">
          <p className="text-sm font-semibold">Date: </p>
        </div>
        <div className="text-right flex items-center gap-2">
          <span className="text-sm font-semibold">Reg No:</span>
          <div className="inline-flex border border-gray-400">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-8 h-8 border-r border-gray-400 last:border-r-0" />
            ))}
          </div>
        </div>
      </div>
      
      <div className="text-right mb-2">
        <p className="text-sm">
          <span className="font-semibold">
            {paperDetails.examType === 'CAT1' && 'CAT I'}
            {paperDetails.examType === 'CAT2' && 'CAT II'}
            {paperDetails.examType === 'SEMESTER' && 'Semester Exam'}
          </span>
         
          <span className="font-semibold">{paperDetails.year}</span>
        </p>
      </div>

      <div className="text-center space-y-1">
        <h1 className="text-lg font-bold">GOVERNMENT COLLEGE OF ENGINEERING, TIRUNELVELI - 627 003</h1>
        <p className="text-sm font-semibold"></p>
        <p className="text-sm">
          Academic Year {paperDetails.academicYear} - ({paperDetails.semester})
        </p>
        <p className="text-sm font-semibold">
          {paperDetails.examType === 'CAT1' && 'Continuous Assessment Test - I'}
          {paperDetails.examType === 'CAT2' && 'Continuous Assessment Test - II'}
          {paperDetails.examType === 'SEMESTER' && 'Semester Examination'}
        </p>
        <p className="text-sm">Common to {paperDetails.department}</p>
        <p className="text-sm font-semibold">
          {paperDetails.year} - (Regulation {paperDetails.regulation})
        </p>
        <p className="text-sm font-semibold">
          {paperDetails.courseCode} - {paperDetails.courseName}
        </p>
      </div>

      <div className="mt-4 flex justify-between text-sm">
        <p>
          <span className="font-semibold">Time:</span> 3 hours
        </p>
        <p>
          <span className="font-semibold">Maximum:</span> 100 Marks
        </p>
      </div>
    </div>
  );
}