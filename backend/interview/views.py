import fitz

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .ai_services import analyze_resume_and_generate_questions


@api_view(["POST"])
def upload_resume(request):

    resume = request.FILES.get("resume")

    if not resume:
        return Response(
            {"error": "Resume is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not resume.name.lower().endswith(".pdf"):
        return Response(
            {"error": "Only PDF files are supported"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        file_data = resume.read()

        document = fitz.open(
            stream=file_data,
            filetype="pdf"
        )

        resume_text = ""

        for page in document:
            resume_text += page.get_text()

        document.close()

        # Send extracted resume text to AI
        ai_result = analyze_resume_and_generate_questions(
            resume_text
        )

        return Response({
            "filename": resume.name,
            "ai_result": ai_result
        })

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )