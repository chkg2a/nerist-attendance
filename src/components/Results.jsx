const Results = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="empty-results">
        <div className="empty-icon">!</div>
        <p>No valid combinations found. Try adding more subjects or adjusting your parameters.</p>
      </div>
    );
  }
  
  // Function to get color based on percentage
  const getPercentageColor = (percentage) => {
    if (percentage >= 75) return 'var(--success-color)';
    if (percentage >= 60) return 'var(--warning-color)';
    return 'var(--danger-color)';
  };
  
  return (
    <div className="combinations-list">
      {results.map((result, index) => (
        <div key={index} className="combination-card">
          <div className="combination-header">
            <h3>Combination {index + 1}</h3>
            <div 
              className="attendance-badge large"
              style={{ backgroundColor: getPercentageColor(result.percentage) }}
            >
              {result.percentage.toFixed(1)}%
            </div>
          </div>
          
          <div className="combination-summary">
            <div className="summary-item">
              <span className="summary-label">Present</span>
              <span className="summary-value">{result.totalPresent}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total</span>
              <span className="summary-value">{result.totalClasses}</span>
            </div>
          </div>
          
          <div className="attendance-bar-container">
            <div 
              className="attendance-bar" 
              style={{ 
                width: `${result.percentage}%`,
                backgroundColor: getPercentageColor(result.percentage)
              }}
            ></div>
          </div>
          
          <div className="subjects-list">
            <h4>Included Subjects</h4>
            {result.subjects.map((subject, i) => (
              <div key={i} className="subject-item">
                <div className="subject-name">{subject.name || `Subject ${subject.id}`}</div>
                <div className="subject-data">
                  <span 
                    className="subject-percentage"
                    style={{ color: getPercentageColor(subject.percentage) }}
                  >
                    {subject.percentage.toFixed(1)}%
                  </span>
                  <span className="subject-attendance">({subject.present}/{subject.total})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Results;
