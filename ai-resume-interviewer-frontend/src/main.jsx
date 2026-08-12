import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API_URL = "https://ai-resume-interviewer-n4xr.onrender.com/api/resume/";

function App() {
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Store complete response from Django
  const [resumeData, setResumeData] = useState(null);

  // Store only interview questions
  const [questions, setQuestions] = useState([]);

  // Controls which screen is displayed
  const [showQuestions, setShowQuestions] = useState(false);

  const chooseFile = (selected) => {
    const f = selected?.[0];

    if (!f) return;

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const validExtension = /\.(pdf|docx)$/i.test(f.name);

    if (!validTypes.includes(f.type) && !validExtension) {
      setStatus("Please upload a PDF or DOCX resume.");
      return;
    }

    if (f.size > 10 * 1024 * 1024) {
      setStatus("File size must be 10 MB or less.");
      return;
    }

    setFile(f);
    setStatus("");
  };

  const generateQuestions = async () => {
    if (!file) {
      setStatus("Please select a resume first.");
      return;
    }

    setLoading(true);
    setStatus("Uploading and analyzing your resume...");

    try {
      const formData = new FormData();

      formData.append("resume", file);

      const response = await fetch(API_URL {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("Django API Response:", data);

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to analyze resume."
        );
      }

      // Store complete Django response
      setResumeData(data);

      // Get interview questions from Django response
      const generatedQuestions =
        data?.ai_result?.interview_questions || [];

      console.log(
        "Generated Questions:",
        generatedQuestions
      );

      if (generatedQuestions.length === 0) {
        throw new Error(
          "AI did not return any interview questions."
        );
      }

      // Store questions in React state
      setQuestions(generatedQuestions);

      setStatus("Questions generated successfully!");

      // Automatically open the questions screen
      setShowQuestions(true);

    } catch (error) {
      console.error("API Error:", error);

      setStatus(
        error.message ||
        "Something went wrong while analyzing the resume."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // QUESTION PAGE
  // ==========================================

  if (showQuestions) {
    return (
      <main className="questions-page">

        <nav className="nav container">
          <div className="brand">
            <span className="brand-mark">✦</span>

            <span>
              Resume<span>AI</span>
            </span>
          </div>

          <button
            className="back-button"
            onClick={() => setShowQuestions(false)}
          >
            ← Upload another resume
          </button>
        </nav>

        <section className="questions-hero container">

          <div className="section-label">
            AI INTERVIEW PREPARATION
          </div>

          <h1>
            Your personalized
            <em> interview questions.</em>
          </h1>

          <p className="questions-intro">
            These questions were generated from the
            information found in your resume.
          </p>

          {/* Candidate information */}

          {resumeData?.ai_result?.candidate_name && (
            <div className="candidate-card">

              <span>Candidate</span>

              <strong>
                {resumeData.ai_result.candidate_name}
              </strong>

            </div>
          )}

          {/* Skills */}

          {resumeData?.ai_result?.resume_analysis?.skills
            ?.length > 0 && (

              <div className="analysis-card">

                <h2>Your Skills</h2>

                <div className="skills-list">

                  {resumeData.ai_result.resume_analysis.skills.map(
                    (skill, index) => (
                      <span key={index}>
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </div>
            )}

          {/* Questions */}

          <div className="questions-list">

            <div className="questions-heading">

              <h2>
                Interview Questions
              </h2>

              <span>
                {questions.length} questions
              </span>

            </div>

            {questions.map((item, index) => (

              <article
                className="question-card"
                key={index}
              >

                <div className="question-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="question-content">

                  <div className="question-meta">

                    <span>
                      {item.category}
                    </span>

                    <span>
                      {item.difficulty}
                    </span>

                  </div>

                  <h3>
                    {item.question}
                  </h3>
                  <div className="answer-box">

                    <strong>
                      💡 Model Answer
                    </strong>

                    <p>
                      {item.answer}
                    </p>

                  </div>
                </div>

              </article>

            ))}

          </div>

          <button
            className="primary new-resume-button"
            onClick={() => {
              setShowQuestions(false);
              setFile(null);
              setQuestions([]);
              setResumeData(null);
              setStatus("");
            }}
          >
            Analyze another resume →
          </button>

        </section>

        <footer className="footer container">

          <div className="brand">

            <span className="brand-mark">
              ✦
            </span>

            <span>
              Resume<span>AI</span>
            </span>

          </div>

          <p>
            Practice smarter. Interview with confidence.
          </p>

        </footer>

      </main>
    );
  }

  // ==========================================
  // UPLOAD PAGE
  // ==========================================

  return (
    <main>

      {/* NAVIGATION */}

      <nav className="nav container">

        <a
          className="brand"
          href="/"
          aria-label="AI Resume Interviewer home"
        >

          <span className="brand-mark">
            ✦
          </span>

          <span>
            Resume<span>AI</span>
          </span>

        </a>

        <div className="nav-links">

          <a href="#how-it-works">
            How it works
          </a>

          <a href="#features">
            Features
          </a>

          <a
            className="nav-button"
            href="#upload"
          >
            Try it free <span>→</span>
          </a>

        </div>

      </nav>


      {/* HERO */}

      <section className="hero container">

        <div className="hero-copy">

          <div className="eyebrow">

            <span></span>

            AI-powered interview preparation

          </div>

          <h1>
            Turn your resume into your
            <em> next interview.</em>
          </h1>

          <p className="hero-text">

            Upload your resume and get interview
            questions tailored to your exact skills,
            projects, experience, and career goals.

          </p>

          <div className="trust-row">

            <div className="avatars">

              <b>JD</b>
              <b>AS</b>
              <b>MK</b>
              <b>+</b>

            </div>

            <span>
              Built for smarter interview practice
            </span>

          </div>

        </div>


        {/* UPLOAD CARD */}

        <div
          className="upload-card"
          id="upload"
        >

          <div
            className={`drop-zone ${dragging ? "dragging" : ""
              } ${file ? "has-file" : ""}`}

            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}

            onDragLeave={() => {
              setDragging(false);
            }}

            onDrop={(e) => {

              e.preventDefault();

              setDragging(false);

              chooseFile(
                e.dataTransfer.files
              );

            }}

            onClick={() =>
              inputRef.current?.click()
            }

            role="button"

            tabIndex="0"

            onKeyDown={(e) => {

              if (e.key === "Enter") {
                inputRef.current?.click();
              }

            }}
          >

            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              hidden
              onChange={(e) =>
                chooseFile(e.target.files)
              }
            />

            <div className="upload-icon">

              {file ? "✓" : "↑"}

            </div>


            {file ? (

              <>

                <h2>
                  {file.name}
                </h2>

                <p>
                  {(file.size / 1024 / 1024).toFixed(2)}
                  {" "}
                  MB · Ready to analyze
                </p>

              </>

            ) : (

              <>

                <h2>
                  Drop your resume here
                </h2>

                <p>
                  or{" "}
                  <strong>
                    browse files
                  </strong>
                  {" "}from your device
                </p>

              </>

            )}

          </div>


          {/* GENERATE BUTTON */}

          <button
            className="primary"
            onClick={generateQuestions}
            disabled={!file || loading}
          >

            {loading
              ? "Analyzing…"
              : "Generate interview questions"}

            <span>
              →
            </span>

          </button>


          <div className="card-meta">

            <span>PDF or DOCX</span>

            <span>•</span>

            <span>Max 10 MB</span>

            <span>•</span>

            <span>AI-powered</span>

          </div>


          {status && (

            <div
              className="status"
              aria-live="polite"
            >
              {status}
            </div>

          )}

        </div>

      </section>


      {/* FEATURES */}

      <section
        className="stats container"
        id="features"
      >

        <div>

          <strong>01</strong>

          <span>
            Resume-aware questions
          </span>

          <p>
            Questions based on what you actually wrote.
          </p>

        </div>

        <div>

          <strong>02</strong>

          <span>
            Multiple difficulty levels
          </span>

          <p>
            Prepare for beginner to advanced rounds.
          </p>

        </div>

        <div>

          <strong>03</strong>

          <span>
            Practice anywhere
          </span>

          <p>
            Responsive on phone, tablet, Mac and Windows.
          </p>

        </div>

      </section>


      {/* HOW IT WORKS */}

      <section
        className="how container"
        id="how-it-works"
      >

        <div className="section-label">
          HOW IT WORKS
        </div>

        <h2>
          From resume to interview-ready in three steps.
        </h2>

        <div className="steps">

          <article>

            <i>01</i>

            <h3>
              Upload
            </h3>

            <p>
              Share your latest PDF or DOCX resume
              securely through the upload box.
            </p>

          </article>


          <article>

            <i>02</i>

            <h3>
              Analyze
            </h3>

            <p>
              Your backend sends the extracted
              resume content to the AI model.
            </p>

          </article>


          <article>

            <i>03</i>

            <h3>
              Practice
            </h3>

            <p>
              Receive technical, project, HR,
              and behavioral questions tailored to you.
            </p>

          </article>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="footer container">

        <div className="brand">

          <span className="brand-mark">
            ✦
          </span>

          <span>
            Resume<span>AI</span>
          </span>

        </div>

        <p>
          Practice smarter. Interview with confidence.
        </p>

      </footer>

    </main>
  );
}

createRoot(
  document.getElementById("root")
).render(
  <App />
);
