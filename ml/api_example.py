from flask import Flask, request, jsonify
from smart_predict import SmartPredictor

app = Flask(__name__)
predictor = SmartPredictor()

@app.route('/predict_all', methods=['POST'])
def predict_all():
    data = request.json
    results = predictor.get_comprehensive_report(data)
    return jsonify({
        "status": "success",
        "results": results
    })

@app.route('/predict_crop', methods=['POST'])
def predict_crop_route():
    from model1_crop.predict import predict_crop
    data = request.json
    crop, confidence = predict_crop(data)
    return jsonify({
        "recommended_crop": crop,
        "confidence_pct": confidence
    })

if __name__ == "__main__":
    print("HarvestLink ML API Example Starting...")
    # app.run(port=5001)
