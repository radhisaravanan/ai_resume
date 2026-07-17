# backend/ai/speech_to_text.py
import sys
import os
import warnings
import whisper

# Suppress annoying FP16 execution warnings on systems without GPU acceleration
warnings.filterwarnings("ignore", category=UserWarning)

def transcribe_audio(file_path):
    if not os.path.exists(file_path):
        print(f"ERROR: Audio file not found at {file_path}")
        sys.exit(1)

    try:
        # Load the base model (you can use 'tiny' if your computer is struggling with speed)
        model = whisper.load_model("base")
        
        # Whisper automatically resamples and processes the audio correctly when loaded this way:
        result = model.transcribe(file_path, fp16=False, language="en")
        
        # Print clean, standardized text to stdout
        print(result["text"].strip())
    except Exception as e:
        print(f"ERROR: Whisper transcription failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("ERROR: No audio file path provided.")
        sys.exit(1)
        
    audio_path = sys.argv[1]
    transcribe_audio(audio_path)