from flask import Flask, Response, request
import cv2
import torch
from ultralytics import YOLO

app = Flask(__name__)

@app.route('/')
def home():
    return "Flask backend is running!"

# Load the trained model
model = YOLO("../model/yolov8s.pt")  # Adjust the path to match your model file

def generate_frames():
    cap = cv2.VideoCapture(0)  # Open the camera (change 0 to video file path if needed)
    
    while True:
        success, frame = cap.read()
        if not success:
            break
        
        # Run YOLO detection
        results = model(frame)

        # Draw bounding boxes on the frame
        for result in results:
            for box in result.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

        # Encode the frame to JPEG
        _, buffer = cv2.imencode(".jpg", frame)
        frame_bytes = buffer.tobytes()
        
        # Yield frame to stream
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
