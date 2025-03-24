import { useState, useEffect } from "react";
import "./App.css";
import SubjectForm from "./components/SubjectForm";
import Results from "./components/Results";
import Header from "./components/Header";
import { subjectsConst } from "./constants/subjects";

function App() {
  const [subjects, setSubjects] = useState(() => {
    const storedSubjects = localStorage.getItem("subjects");
    return storedSubjects ? JSON.parse(storedSubjects) : subjectsConst;
  });

  const [topSubjectsCount, setTopSubjectsCount] = useState(5);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [hasChanges, setHasChanges] = useState(false); // Track unsaved changes

  const saveSubjectsToLocalStorage = () => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
    setHasChanges(false); // Reset change tracker after saving
  };

  const addSubject = () => {
    setSubjects((prevSubjects) => [
      ...prevSubjects,
      { id: Date.now(), name: "", present: 0, total: 0 },
    ]);
    setHasChanges(true);
  };

  const removeSubject = (id) => {
    setSubjects((prevSubjects) => prevSubjects.filter((subject) => subject.id !== id));
    setHasChanges(true);
  };

  const updateSubject = (id, field, value) => {
    setSubjects((prevSubjects) =>
      prevSubjects.map((subject) =>
        subject.id === id
          ? {
              ...subject,
              [field]: field === "present" || field === "total" ? Number(value) : value,
            }
          : subject
      )
    );
    setHasChanges(true);
  };

  const calculateAttendance = (present, total) => (total > 0 ? (present / total) * 100 : 0);

  const generateCombinations = (array, k) => {
    const result = [];

    function combine(start, current) {
      if (current.length === k) {
        result.push([...current]);
        return;
      }
      for (let i = start; i < array.length; i++) {
        current.push(array[i]);
        combine(i + 1, current);
        current.pop();
      }
    }

    combine(0, []);
    return result;
  };

  const calculateCombinationAttendance = (subjects) => {
    const totalPresent = subjects.reduce((sum, s) => sum + Number(s.present), 0);
    const totalClasses = subjects.reduce((sum, s) => sum + Number(s.total), 0);
    return {
      totalPresent,
      totalClasses,
      percentage: totalClasses > 0 ? calculateAttendance(totalPresent, totalClasses) : 0,
    };
  };

  const calculateBestCombinations = () => {
    const subjectsData = subjects.map((subject) => ({
      ...subject,
      percentage: calculateAttendance(Number(subject.present), Number(subject.total)),
    }));

    if (subjectsData.length === 0) {
      alert("Please add at least one subject.");
      return;
    }

    if (topSubjectsCount > subjectsData.length) {
      alert(`You only have ${subjectsData.length} subjects. Please enter a smaller number.`);
      return;
    }

    const combinations = generateCombinations(subjectsData, topSubjectsCount);
    const combinationResults = combinations.map((combo) => ({
      subjects: combo,
      ...calculateCombinationAttendance(combo),
    }));

    combinationResults.sort((a, b) => b.percentage - a.percentage);

    setResults(combinationResults);
    setShowResults(true);
  };

  const resetCalculation = () => {
    setShowResults(false);
    setResults([]);
  };

  const handleTopSubjectsChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setTopSubjectsCount(value === "" ? "" : parseInt(value, 10));
    }
  };

  const handleTopSubjectsBlur = () => {
    setTopSubjectsCount(Math.max(1, Math.min(topSubjectsCount, subjects.length)));
  };

  return (
    <div className="w-screen flex justify-center">
      <div className="app-container">
        <div className="app-content">
          <Header />
          <div className="form-container">
            <h2 className="section-title">Your Subjects</h2>

            <div className="subjects-container">
              {subjects.map((subject) => (
                <SubjectForm
                  key={subject.id}
                  subject={subject}
                  updateSubject={updateSubject}
                  removeSubject={removeSubject}
                />
              ))}
            </div>

            <div className="controls">
              <button className="btn btn-add" onClick={addSubject}>
                <span className="btn-icon">+</span> Add Subject
              </button>

              <button
                className="btn btn-save"
                onClick={saveSubjectsToLocalStorage}
              >
                <span className="btn-icon">💾</span> Save Changes
              </button>

              <div className="top-subjects-control">
                <label htmlFor="topSubjects">Calculate best</label>
                <input
                  type="number"
                  id="topSubjects"
                  min="1"
                  max={subjects.length}
                  value={topSubjectsCount}
                  onChange={handleTopSubjectsChange}
                  onBlur={handleTopSubjectsBlur}
                />
                <label htmlFor="topSubjects">subjects combination</label>
              </div>

              <button
                className="btn btn-calculate"
                onClick={calculateBestCombinations}
                disabled={subjects.length === 0}
              >
                <span className="btn-icon">✓</span> Calculate
              </button>
            </div>
          </div>

          {showResults && (
            <div className="results-section">
              <div className="results-header">
                <h2 className="section-title">Best Attendance Combinations</h2>
                <button className="btn btn-reset" onClick={resetCalculation}>
                  <span className="btn-icon">↺</span> Reset
                </button>
              </div>
              <Results results={results} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
