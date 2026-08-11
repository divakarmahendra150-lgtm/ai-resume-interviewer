import os
import json

from dotenv import load_dotenv
from groq import Groq


load_dotenv()


client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def analyze_resume_and_generate_questions(resume_text):

    # Prevent extremely large resumes
    resume_text = resume_text[:20000]

    prompt = f"""
You are an expert technical interviewer.

Analyze the resume below and create personalized
interview questions and model answers.

IMPORTANT:
- Use ONLY information present in the resume.
- Do not invent skills, projects, companies,
  technologies, education, or experience.
- Generate exactly 25 questions.
- Every question MUST have a corresponding answer.
- The answer should be a useful interview-style
  model answer based on the candidate's resume.
- If the resume does not contain enough information
  for an exact answer, provide a safe answer based
  only on the available resume information.

RESUME:
{resume_text}

Generate questions from:

1. Technical skills
2. Projects
3. Technologies
4. Work experience
5. Education
6. HR / behavioral topics

Each question must contain:

- category
- difficulty
- question
- answer

Return ONLY valid JSON.

Use EXACTLY this structure:

{{
    "candidate_name": "",
    "resume_analysis": {{
        "skills": [],
        "projects": [],
        "experience": [],
        "education": []
    }},
    "interview_questions": [
        {{
            "category": "Technical",
            "difficulty": "Easy",
            "question": "Question based on the resume",
            "answer": "A suitable interview answer based on the resume"
        }}
    ]
}}
"""

    try:

        response = client.chat.completions.create(

            model="openai/gpt-oss-20b",

            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert technical interviewer. "
                        "Generate personalized interview questions "
                        "and model answers. "
                        "Return ONLY valid JSON."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.2,

            max_completion_tokens=3500,

            response_format={
                "type": "json_object"
            }
        )

        ai_output = response.choices[0].message.content

        print("AI RESPONSE:")
        print(ai_output)

        return json.loads(ai_output)

    except Exception as e:

        print("AI ERROR:")
        print(e)

        raise e