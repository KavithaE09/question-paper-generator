import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const TemplateFooter = ({ questions = [] }) => {
  // Helper to get question number based on part
  const getQuestionNumber = (question, allQuestions) => {
    const part = question.part || 'A';
    const partQuestions = allQuestions.filter(q => q.part === part);
    const index = partQuestions.indexOf(question);
    
    if (part === 'A') {
      return `${index + 1}`;
    } else if (part === 'B') {
      const qNum = 11 + Math.floor(index / 2);
      const choice = index % 2 === 0 ? 'a' : 'b';
      return `${qNum}${choice}`;
    } else if (part === 'C') {
      const choice = index % 2 === 0 ? 'a' : 'b';
      return `16${choice}`;
    }
    return `${index + 1}`;
  };

  // Calculate Bloom's Level distribution
  const bloomsData = useMemo(() => {
    const bloomLevels = { K1: 0, K2: 0, K3: 0, K4: 0 };
    const bloomQuestions = { K1: [], K2: [], K3: [], K4: [] };

    questions.forEach(q => {
      const bloom = q.bloom?.toUpperCase();
      if (bloom && bloomLevels.hasOwnProperty(bloom)) {
        bloomLevels[bloom] += Number(q.marks) || 0;
        bloomQuestions[bloom].push(getQuestionNumber(q, questions));
      }
    });

    const total = 180; // Fixed total as per document
    
    return Object.entries(bloomLevels).map(([level, marks]) => ({
      level,
      questionNos: bloomQuestions[level].join(', '),
      marks,
      percentage: marks > 0 ? ((marks / total) * 100).toFixed(1) : ''
    }));
  }, [questions]);

  // Calculate Course Outcomes distribution
  const coData = useMemo(() => {
    const outcomes = { CO1: 0, CO2: 0, CO3: 0 };
    const coQuestions = { CO1: [], CO2: [], CO3: [] };
    
    questions.forEach(q => {
      const co = q.courseOutcome?.toUpperCase();
      if (co && outcomes.hasOwnProperty(co)) {
        outcomes[co] += Number(q.marks) || 0;
        coQuestions[co].push(getQuestionNumber(q, questions));
      }
    });

    const total = 180;
    
    return Object.entries(outcomes).map(([outcome, marks]) => ({
      outcome,
      questionNos: coQuestions[outcome].join(', '),
      marks,
      percentage: marks > 0 ? ((marks / total) * 100).toFixed(1) : ''
    }));
  }, [questions]);

  // Calculate Knowledge Level distribution
  const knowledgeData = useMemo(() => {
    const levels = { F: 0, C: 0, P: 0, M: 0 };
    const kcQuestions = { F: [], C: [], P: [], M: [] };

    questions.forEach(q => {
      // Map based on unit for now (you can modify this logic)
      const unit = q.unit;
      let kc = 'C'; // default
      if (unit === 1) kc = 'F';
      else if (unit === 2) kc = 'C';
      else if (unit === 3) kc = 'P';
      else if (unit === 4 || unit === 5) kc = 'M';
      
      if (levels.hasOwnProperty(kc)) {
        levels[kc] += Number(q.marks) || 0;
        kcQuestions[kc].push(getQuestionNumber(q, questions));
      }
    });

    const total = 180;
    
    return Object.entries(levels).map(([level, marks]) => ({
      level,
      questionNos: kcQuestions[level].join(', '),
      marks,
      percentage: marks > 0 ? ((marks / total) * 100).toFixed(1) : ''
    }));
  }, [questions]);

  // Calculate Program Outcomes distribution
  const poData = useMemo(() => {
    const outcomes = { PO1: 0, PO2: 0, PO3: 0, PO4: 0 };
    const poPI = { PO1: [], PO2: [], PO3: [], PO4: [] };
    
    questions.forEach(q => {
      const po = q.programOutcome?.toUpperCase().replace(/\s/g, '');
      if (po && outcomes.hasOwnProperty(po)) {
        outcomes[po] += Number(q.marks) || 0;
        // Collect PI values if they exist
        if (q.pi) {
          poPI[po].push(q.pi);
        }
      }
    });

    const total = 180;
    
    return Object.entries(outcomes).map(([outcome, marks]) => {
      const piList = [...new Set(poPI[outcome])].join(', '); // Remove duplicates
      
      return {
        outcome,
        piList,
        marks,
        percentage: marks > 0 ? ((marks / total) * 100).toFixed(1) : ''
      };
    });
  }, [questions]);

  return (
    <div className="template-footer mt-8 pt-6">
      <style>{`
        .consolidation-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 25px;
          font-size: 10px;
          page-break-inside: avoid;
          border: 2px solid #000;
        }
        .consolidation-table th,
        .consolidation-table td {
          border: 1.5px solid #000;
          padding: 8px 10px;
          text-align: left;
        }
        .consolidation-table th {
          background-color: #e8e8e8;
          font-weight: bold;
          text-align: center;
          border: 1.5px solid #000;
        }
        .consolidation-table .total-row {
          font-weight: bold;
          background-color: #f5f5f5;
          border-top: 2px solid #000;
        }
        .consolidation-table td:nth-child(3),
        .consolidation-table td:nth-child(4) {
          text-align: center;
        }
        .consolidation-table th:nth-child(3),
        .consolidation-table th:nth-child(4) {
          text-align: center;
        }
        .signature-section {
          display: flex;
          justify-content: space-between;
          margin-top: 50px;
          font-weight: bold;
          font-size: 11px;
          page-break-inside: avoid;
        }
        @media print {
          .template-footer {
            page-break-before: auto;
          }
        }
      `}</style>

      {/* Bloom's Level Table */}
      <table className="consolidation-table">
        <thead>
          <tr>
            <th style={{ width: '20%' }}>Bloom's Level</th>
            <th style={{ width: '55%' }}>Questions No.s</th>
            <th style={{ width: '15%' }}>Marks</th>
            <th style={{ width: '10%' }}>%</th>
          </tr>
        </thead>
        <tbody>
          {bloomsData.map((item) => (
            <tr key={item.level}>
              <td><strong>{item.level}</strong></td>
              <td>{item.questionNos || ''}</td>
              <td style={{ textAlign: 'center' }}>{item.marks || ''}</td>
              <td style={{ textAlign: 'center' }}>{item.percentage || ''}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td colSpan="2" style={{ textAlign: 'right' }}><strong>TOTAL</strong></td>
            <td style={{ textAlign: 'center' }}><strong>180</strong></td>
            <td style={{ textAlign: 'center' }}><strong>100.0</strong></td>
          </tr>
        </tbody>
      </table>

      {/* Course Outcomes Table */}
      <table className="consolidation-table">
        <thead>
          <tr>
            <th style={{ width: '20%' }}>Outcomes</th>
            <th style={{ width: '55%' }}>Questions No.s</th>
            <th style={{ width: '15%' }}>Marks</th>
            <th style={{ width: '10%' }}>%</th>
          </tr>
        </thead>
        <tbody>
          {coData.map((item) => (
            <tr key={item.outcome}>
              <td><strong>{item.outcome}</strong></td>
              <td>{item.questionNos || ''}</td>
              <td style={{ textAlign: 'center' }}>{item.marks || ''}</td>
              <td style={{ textAlign: 'center' }}>{item.percentage || ''}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td style={{ textAlign: 'right' }}><strong>TOTAL</strong></td>
            <td></td>
            <td style={{ textAlign: 'center' }}><strong>180</strong></td>
            <td style={{ textAlign: 'center' }}><strong>100.0</strong></td>
          </tr>
        </tbody>
      </table>

      {/* Knowledge Level Table */}
      <table className="consolidation-table">
        <thead>
          <tr>
            <th style={{ width: '20%' }}>Knowledge Level</th>
            <th style={{ width: '55%' }}>Questions No.s</th>
            <th style={{ width: '15%' }}>Marks</th>
            <th style={{ width: '10%' }}>%</th>
          </tr>
        </thead>
        <tbody>
          {knowledgeData.map((item) => (
            <tr key={item.level}>
              <td><strong>{item.level}</strong></td>
              <td>{item.questionNos || ''}</td>
              <td style={{ textAlign: 'center' }}>{item.marks || ''}</td>
              <td style={{ textAlign: 'center' }}>{item.percentage || ''}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td colSpan="2" style={{ textAlign: 'right' }}><strong>TOTAL</strong></td>
            <td style={{ textAlign: 'center' }}><strong>180</strong></td>
            <td style={{ textAlign: 'center' }}><strong>100.0</strong></td>
          </tr>
        </tbody>
      </table>

      {/* Program Outcomes Table */}
      <table className="consolidation-table">
        <thead>
          <tr>
            <th style={{ width: '20%' }}>PO's</th>
            <th style={{ width: '55%' }}>PI's</th>
            <th style={{ width: '15%' }}>Marks</th>
            <th style={{ width: '10%' }}>%</th>
          </tr>
        </thead>
        <tbody>
          {poData.map((item) => (
            <tr key={item.outcome}>
              <td><strong>{item.outcome}</strong></td>
              <td>{item.piList || ''}</td>
              <td style={{ textAlign: 'center' }}>{item.marks || ''}</td>
              <td style={{ textAlign: 'center' }}>{item.percentage || ''}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td colSpan="2" style={{ textAlign: 'right' }}><strong>TOTAL</strong></td>
            <td style={{ textAlign: 'center' }}><strong>180</strong></td>
            <td style={{ textAlign: 'center' }}><strong>100.0</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

TemplateFooter.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    part: PropTypes.string,
    unit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    marks: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bloom: PropTypes.string,
    courseOutcome: PropTypes.string,
    programOutcome: PropTypes.string,
    pi: PropTypes.string
  }))
};

export default TemplateFooter;