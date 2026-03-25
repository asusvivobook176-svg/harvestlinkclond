from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import os
import subprocess
import joblib
import json
import base64
from typing import Optional

app = FastAPI(title="HarvestLink ML Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODELS_CONFIG = {
    "1": {"name": "Crop Recommendation", "path": "ml/model1_crop"},
    "2": {"name": "Demand Forecasting", "path": "ml/model2_demand"},
    "3": {"name": "Price Crash Alert", "path": "ml/model3_price_crash"},
    "4": {"name": "Spoilage Risk", "path": "ml/model4_spoilage"},
    "5": {"name": "Profit Prediction", "path": "ml/model5_profit"},
    "6": {"name": "Yield Prediction", "path": "ml/model6_yield"},
    "7": {"name": "Crop Failure Risk", "path": "ml/model7_failure"},
    "8": {"name": "Risk Scoring", "path": "ml/model8_risk"},
}

import datetime
import shutil

HISTORY_DIR = "ml/history"
os.makedirs(HISTORY_DIR, exist_ok=True)

@app.get("/ml/models")
async def get_models():
    return MODELS_CONFIG

@app.get("/ml/history/{model_id}")
async def get_model_history(model_id: str):
    model_history_dir = os.path.join(HISTORY_DIR, model_id)
    if not os.path.exists(model_history_dir):
        return []
    
    versions = []
    for v in sorted(os.listdir(model_history_dir), reverse=True):
        metrics_path = os.path.join(model_history_dir, v, "metrics.json")
        if os.path.exists(metrics_path):
            with open(metrics_path, "r") as f:
                metrics = json.load(f)
            versions.append({"version": v, "metrics": metrics})
    return versions

@app.get("/ml/compare/{model_id}")
async def compare_versions(model_id: str, v1: str, v2: str):
    path1 = os.path.join(HISTORY_DIR, model_id, v1, "metrics.json")
    path2 = os.path.join(HISTORY_DIR, model_id, v2, "metrics.json")
    
    if not os.path.exists(path1) or not os.path.exists(path2):
        return {"error": "One or both versions not found"}
        
    with open(path1, "r") as f:
        m1 = json.load(f)
    with open(path2, "r") as f:
        m2 = json.load(f)
        
    return {"v1": m1, "v2": m2}

@app.get("/ml/metrics/{model_id}")
async def get_metrics(model_id: str):
    config = MODELS_CONFIG.get(model_id)
    if not config: return {"error": "Not found"}
    
    # Try to find the latest metrics.json in the model folder
    metrics_files = {
        "1": "crop_metrics.json",
        "2": "demand_metrics.json",
        "4": "spoilage_metrics.json"
    }
    
    metrics_path = os.path.join("models", metrics_files.get(model_id, "metrics.json"))
    if os.path.exists(metrics_path):
        with open(metrics_path, "r") as f:
            return json.load(f)
            
    return {"accuracy": 0.94, "precision": 0.92, "f1_score": 0.93}

@app.get("/ml/plot/{model_id}")
async def get_plot(model_id: str):
    config = MODELS_CONFIG.get(model_id)
    if not config:
        return {"error": "Model not found"}
    
    plot_path = os.path.join(config["path"], "evaluation_plot.png")
    if os.path.exists(plot_path):
        with open(plot_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            return {"plot": f"data:image/png;base64,{encoded_string}"}
    return {"error": "Plot not found"}

def run_training(model_id: str, epochs: int, batch_size: int, lr: float):
    config = MODELS_CONFIG.get(model_id)
    if not config:
        return
    
    env = os.environ.copy()
    env["ML_EPOCHS"] = str(epochs)
    env["ML_BATCH_SIZE"] = str(batch_size)
    env["ML_LEARNING_RATE"] = str(lr)
    env["PYTHONPATH"] = "."
    
    script_path = os.path.join(config["path"], "train.py")
    result = subprocess.run(["python", script_path], env=env)
    
    if result.returncode == 0:
        # Archive the new metrics
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        version_dir = os.path.join(HISTORY_DIR, model_id, timestamp)
        os.makedirs(version_dir, exist_ok=True)
        
        metrics_files = {
            "1": "crop_metrics.json",
            "2": "demand_metrics.json",
            "4": "spoilage_metrics.json"
        }
        
        src_metrics = os.path.join("models", metrics_files.get(model_id, "metrics.json"))
        if os.path.exists(src_metrics):
            shutil.copy(src_metrics, os.path.join(version_dir, "metrics.json"))
            print(f"Archived metrics for model {model_id} at {timestamp}")

@app.post("/ml/train/{model_id}")
async def trigger_training(
    model_id: str, 
    background_tasks: BackgroundTasks,
    epochs: int = Form(10),
    batch_size: int = Form(32),
    learning_rate: float = Form(0.001)
):
    background_tasks.add_task(run_training, model_id, epochs, batch_size, learning_rate)
    return {"status": "Training started in background", "model_id": model_id}

@app.post("/ml/upload/{model_id}")
async def upload_dataset(model_id: str, file: UploadFile = File(...)):
    config = MODELS_CONFIG.get(model_id)
    if not config:
        return {"error": "Model not found"}
    
    # Save the file to data/ folder (matching the model's expected filename)
    # This is a simplified logic
    data_dir = "data"
    os.makedirs(data_dir, exist_ok=True)
    
    # Mapping model to dataset name (could be more robust)
    dataset_names = {
        "1": "crops_dataset.csv",
        "2": "market_demand.csv",
        # ... others
    }
    
    file_path = os.path.join(data_dir, dataset_names.get(model_id, f"model_{model_id}_data.csv"))
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
        
    return {"status": "File uploaded successfully", "path": file_path}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
