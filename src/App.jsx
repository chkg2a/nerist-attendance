// App.jsx
import { useState, useEffect } from "react";
import "./App.css";
import SubjectForm from "./components/SubjectForm";
import Results from "./components/Results";
import Header from "./components/Header";

function App() {
  const [subjects, setSubjects] = useState([]);
  const [topSubjectsCount, setTopSubjectsCount] = useState(3);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Initialize with default subjects
  useEffect(() => {
    if (subjects.length === 0) {
      setSubjects([
        {
          id: 1,
          name: "HS22201 Entrepreneurship and Startup",
          present: 0,
          total: 21,
        },
        {
          id: 2,
          name: "HS22277 Indian Constitution",
          present: 0,
          total: 16,
        },
        {
          id: 3,
          name: "CS22200 Discrete Mathematics",
          present: 0,
          total: 31,
        },
        {
          id: 4,
          name: "CS22201 Computer Organization and Architecture",
          present: 0,
          total: 15,
        },
        {
          id: 5,
          name: "CS22202 Programming in Java",
          present: 0,
          total: 11,
        },
        {
          id: 6,
          name: "CS22203 Design and Analysis of Algorithms",
          present: 0,
          total: 22,
        },
      ]);
    }
  }, []);

  const addSubject = () => {
    const newSubject = {
      id: Date.now(),
      name: "",
      present: 0,
      total: 1,
    };

    setSubjects((prevSubjects) => [...prevSubjects, newSubject]);
  };

  const removeSubject = (id) => {
    setSubjects((prevSubjects) =>
      prevSubjects.filter((subject) => subject.id !== id),
    );
  };

  const updateSubject = (id, field, value) => {
    setSubjects((prevSubjects) =>
      prevSubjects.map((subject) =>
        subject.id === id ? { ...subject, [field]: value } : subject,
      ),
    );
  };

  const calculateAttendance = (present, total) => {
    return total > 0 ? (present / total) * 100 : 0;
  };

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
    let totalPresent = 0;
    let totalClasses = 0;

    subjects.forEach((subject) => {
      totalPresent += subject.present;
      totalClasses += subject.total;
    });

    return {
      totalPresent,
      totalClasses,
      percentage:
        totalClasses > 0 ? calculateAttendance(totalPresent, totalClasses) : 0,
    };
  };

  const calculateBestCombinations = () => {
    // Prepare subject data with percentages
    const subjectsData = subjects.map((subject) => {
      const percentage = calculateAttendance(subject.present, subject.total);
      return {
        ...subject,
        percentage,
      };
    });

    // Validate inputs
    if (subjectsData.length === 0) {
      alert("Please add at least one subject.");
      return;
    }

    if (topSubjectsCount > subjectsData.length) {
      alert(
        `You only have ${subjectsData.length} subjects. Please enter a smaller number.`,
      );
      return;
    }

    // Generate all possible combinations of subjects
    const combinations = generateCombinations(subjectsData, topSubjectsCount);

    // Calculate attendance for each combination
    const combinationResults = combinations.map((combo) => {
      const attendanceResult = calculateCombinationAttendance(combo);
      return {
        subjects: combo,
        ...attendanceResult,
      };
    });

    // Sort results by percentage (highest first)
    combinationResults.sort((a, b) => b.percentage - a.percentage);

    setResults(combinationResults);
    setShowResults(true);
  };

  const resetCalculation = () => {
    setShowResults(false);
    setResults([]);
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

              <div className="top-subjects-control">
                <label htmlFor="topSubjects">Calculate best</label>
                <input
                  type="number"
                  id="topSubjects"
                  min="1"
                  max={subjects.length}
                  value={topSubjectsCount}
                  onChange={(e) =>
                    setTopSubjectsCount(parseInt(e.target.value) || 1)
                  }
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
