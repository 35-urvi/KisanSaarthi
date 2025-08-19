import os
from typing import Dict, Any, Tuple

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


_MODEL_SINGLETON: Tuple[Pipeline, Dict[str, Any]] | None = None


def _get_data_path() -> str:
    # backend/api/ml -> backend/api -> backend
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    backend_root = os.path.dirname(backend_dir)
    return os.path.join(backend_root, "data", "Fertilizer Prediction.csv")


def _get_cache_path() -> str:
    # Cache alongside this file
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), "fertilizer_model.joblib")


def _normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    # Fix common typos and trim spaces
    rename_map = {
        "Temparature": "Temperature",
        "Humidity ": "Humidity",
        "Phosphorous": "Phosphorus",
        "Soil Type": "SoilType",
        "Crop Type": "CropType",
        "Fertilizer Name": "Fertilizer",
    }
    df = df.rename(columns=rename_map)
    # Strip whitespace from object columns
    for col in df.select_dtypes(include=["object"]).columns:
        df[col] = df[col].astype(str).str.strip()
    return df


def _load_dataset() -> pd.DataFrame:
    csv_path = _get_data_path()
    df = pd.read_csv(csv_path)
    df = _normalize_columns(df)
    return df


def _build_pipeline(df: pd.DataFrame) -> Tuple[Pipeline, Dict[str, Any]]:
    target = "Fertilizer"
    numeric_features = [
        "Temperature",
        "Humidity",
        "Moisture",
        "Nitrogen",
        "Potassium",
        "Phosphorus",
    ]
    categorical_features = [
        "SoilType",
        "CropType",
    ]

    X = df[numeric_features + categorical_features]
    y = df[target]

    numeric_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
    ])

    categorical_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore")),
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, numeric_features),
            ("cat", categorical_transformer, categorical_features),
        ]
    )

    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=None,
        min_samples_split=2,
        min_samples_leaf=1,
        random_state=42,
        n_jobs=-1,
    )

    pipeline = Pipeline(steps=[
        ("preprocess", preprocessor),
        ("model", model),
    ])

    # Train/validation split for simple quality check
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    acc = float(accuracy_score(y_test, y_pred))

    meta = {
        "accuracy": acc,
        "classes": sorted(y.unique().tolist()),
        "numeric_features": numeric_features,
        "categorical_features": categorical_features,
    }

    return pipeline, meta


def _load_or_train() -> Tuple[Pipeline, Dict[str, Any]]:
    cache_path = _get_cache_path()
    if os.path.exists(cache_path):
        try:
            pipeline, meta = joblib.load(cache_path)
            return pipeline, meta
        except Exception:
            pass

    df = _load_dataset()
    pipeline, meta = _build_pipeline(df)
    try:
        joblib.dump((pipeline, meta), cache_path)
    except Exception:
        # Non-fatal if caching fails
        pass
    return pipeline, meta


def get_model() -> Tuple[Pipeline, Dict[str, Any]]:
    global _MODEL_SINGLETON
    if _MODEL_SINGLETON is None:
        _MODEL_SINGLETON = _load_or_train()
    return _MODEL_SINGLETON


def _coerce_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    # Accept multiple key variants from frontend and coerce types
    def _get(keys, default=None):
        for k in keys:
            if k in payload and payload[k] is not None:
                return payload[k]
        return default

    crop = _get(["crop", "crop_type", "CropType"]) or ""
    soil = _get(["soil", "soil_type", "SoilType"]) or ""

    def _to_float(v):
        try:
            return float(v)
        except Exception:
            return np.nan

    coerced = {
        "Temperature": _to_float(_get(["temperature", "temp", "Temperature"])),
        "Humidity": _to_float(_get(["humidity", "Humidity"])),
        "Moisture": _to_float(_get(["moisture", "Moisture"])),
        "Nitrogen": _to_float(_get(["nitrogen", "N", "Nitrogen"])),
        "Potassium": _to_float(_get(["potassium", "K", "Potassium"])),
        "Phosphorus": _to_float(_get(["phosphorus", "phosphorous", "P", "Phosphorus"])),
        "SoilType": str(soil).strip().title() if soil else None,
        "CropType": str(crop).strip().title() if crop else None,
    }

    # Minimal defaults if some optional fields are missing, to work with UI sending only NPK + crop
    if pd.isna(coerced["Temperature"]):
        coerced["Temperature"] = 30.0
    if pd.isna(coerced["Humidity"]):
        coerced["Humidity"] = 60.0
    if pd.isna(coerced["Moisture"]):
        coerced["Moisture"] = 40.0

    return coerced


def predict_from_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    pipeline, meta = get_model()
    features = _coerce_payload(payload)
    df = pd.DataFrame([features])
    proba = None
    try:
        proba = pipeline.predict_proba(df)[0]
        classes = pipeline.named_steps["model"].classes_
        idx = int(np.argmax(proba))
        fertilizer = str(classes[idx])
        confidence = float(proba[idx])
    except Exception:
        fertilizer = str(pipeline.predict(df)[0])
        confidence = 0.0

    # Simple heuristic dosage suggestion by fertilizer type
    base_dosage = {
        "Urea": 100,
        "DAP": 80,
        "20-20": 90,
        "28-28": 90,
        "17-17-17": 90,
        "14-35-14": 70,
        "10-26-26": 70,
    }

    suggested = 90
    method = "Basal dose"
    for key, val in base_dosage.items():
        if key.lower() in fertilizer.lower():
            suggested = val
            break

    # Adjust dosage a bit by nitrogen deficit/excess
    nitrogen = features.get("Nitrogen") or 0.0
    if nitrogen < 15:
        suggested += 20
    elif nitrogen > 35:
        suggested -= 10
    suggested = int(max(40, min(200, suggested)))

    response = {
        "fertilizer": fertilizer,
        "confidence": round(confidence * 100, 2),
        "dosage_kg_per_acre": suggested,
        "application_method": method,
        "meta": {
            "model_accuracy": round(meta.get("accuracy", 0.0) * 100, 2),
            "used_features": features,
        },
    }
    return response


