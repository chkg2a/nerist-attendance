import { useState, useEffect } from "react";

const SubjectForm = ({ subject, updateSubject, removeSubject }) => {
  const [localPresent, setLocalPresent] = useState(subject.present);
  const [localTotal, setLocalTotal] = useState(subject.total);
  const [percentage, setPercentage] = useState(0);

  // Update local state when props change
  useEffect(() => {
    setLocalPresent(subject.present);
    setLocalTotal(subject.total);
  }, [subject.present, subject.total]);

  // Calculate percentage when local values change
  useEffect(() => {
    const newPercentage =
      localTotal > 0 ? (localPresent / localTotal) * 100 : 0;
    setPercentage(newPercentage);
  }, [localPresent, localTotal]);

  // const handlePresentChange = (e) => {
  //   const value = parseInt(e.target.value) || 0;
  //   setLocalPresent(value);
  //   updateSubject(subject.id, 'present', value);
  // };
  //
  // const handleTotalChange = (e) => {
  //   const value = parseInt(e.target.value) || 1;
  //   setLocalTotal(value);
  //   updateSubject(subject.id, 'total', value);
  // };
  const handlePresentChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setLocalPresent(value === "" ? "" : parseInt(value, 10));
    }
  };

  const handleTotalChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setLocalTotal(value === "" ? "" : parseInt(value, 10));
    }
  };

  // Commit valid changes when the input loses focus
  const handleBlur = (field) => {
    if (field === "present") {
      const validValue = localPresent === "" ? 0 : localPresent;
      setLocalPresent(validValue);
      updateSubject(subject.id, "present", validValue);
    } else if (field === "total") {
      const validValue = localTotal === "" ? 1 : localTotal;
      setLocalTotal(validValue);
      updateSubject(subject.id, "total", validValue);
    }
  };

  const handleNameChange = (e) => {
    updateSubject(subject.id, "name", e.target.value);
  };

  // Calculate color based on attendance percentage
  const getPercentageColor = () => {
    if (percentage >= 75) return "var(--success-color)";
    if (percentage >= 60) return "var(--warning-color)";
    return "var(--danger-color)";
  };

  return (
    <div className="subject-card">
      <div className="subject-header">
        <div
          className="attendance-badge"
          style={{ backgroundColor: getPercentageColor() }}
        >
          {percentage.toFixed(1)}%
        </div>
        <button
          className="btn-icon-only btn-remove"
          onClick={() => removeSubject(subject.id)}
          title="Remove subject"
        >
          ×
        </button>
      </div>

      <div className="input-group">
        <label htmlFor={`name-${subject.id}`}>Subject Name</label>
        <input
          type="text"
          id={`name-${subject.id}`}
          placeholder="Enter subject name"
          value={subject.name}
          onChange={handleNameChange}
        />
      </div>

      <div className="attendance-inputs">
        <div className="input-group">
          <label htmlFor={`present-${subject.id}`}>Classes Present</label>
          <input
            type="number"
            id={`present-${subject.id}`}
            min="0"
            max={localTotal}
            value={localPresent}
            onChange={handlePresentChange}
            onBlur={() => handleBlur("present")}
          />
        </div>

        <div className="input-divider">of</div>

        <div className="input-group">
          <label htmlFor={`total-${subject.id}`}>Total Classes</label>
          <input
            type="number"
            id={`total-${subject.id}`}
            min="1"
            value={localTotal}
            onChange={handleTotalChange}
            onBlur={() => handleBlur("present")}
          />
        </div>
      </div>

      <div className="attendance-bar-container">
        <div
          className="attendance-bar"
          style={{
            width: `${percentage}%`,
            backgroundColor: getPercentageColor(),
          }}
        ></div>
      </div>
    </div>
  );
};

export default SubjectForm;
