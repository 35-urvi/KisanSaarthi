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


_MODEL_SINGLETON: Tuple[Pipeline, Dict[str, Any]] | None = None


def _get_data_path() -> str:
    # backend/api/ml -> backend
    api_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    backend_root = os.path.dirname(api_dir)
    return os.path.join(backend_root, "data", "Crop_recommendation.csv")


def _get_cache_path() -> str:
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), "crop_model.joblib")


def _load_dataset() -> pd.DataFrame:
    csv_path = _get_data_path()
    df = pd.read_csv(csv_path)
    # Normalize column names to a canonical form expected by model
    rename_map = {
        "N": "Nitrogen",
        "P": "Phosphorus",
        "K": "Potassium",
        "temperature": "Temperature",
        "humidity": "Humidity",
        "ph": "pH",
        "rainfall": "Rainfall",
        "label": "Crop",
    }
    df = df.rename(columns=rename_map)
    # Strip whitespace and standardize crop labels to title case
    df["Crop"] = df["Crop"].astype(str).str.strip()
    return df


def _build_pipeline(df: pd.DataFrame) -> Tuple[Pipeline, Dict[str, Any]]:
    target = "Crop"
    numeric_features = [
        "Nitrogen",
        "Phosphorus",
        "Potassium",
        "Temperature",
        "Humidity",
        "pH",
        "Rainfall",
    ]

    X = df[numeric_features]
    y = df[target]

    numeric_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, numeric_features),
        ]
    )

    model = RandomForestClassifier(
        n_estimators=500,
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
        pass
    return pipeline, meta


def get_model() -> Tuple[Pipeline, Dict[str, Any]]:
    global _MODEL_SINGLETON
    if _MODEL_SINGLETON is None:
        _MODEL_SINGLETON = _load_or_train()
    return _MODEL_SINGLETON


def _coerce_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    def _get(keys, default=None):
        for k in keys:
            if k in payload and payload[k] is not None:
                return payload[k]
        return default

    def _to_float(v):
        try:
            return float(v)
        except Exception:
            return np.nan

    coerced = {
        "Nitrogen": _to_float(_get(["nitrogen", "N", "Nitrogen"])),
        "Phosphorus": _to_float(_get(["phosphorus", "P", "Phosphorus"])),
        "Potassium": _to_float(_get(["potassium", "K", "Potassium"])),
        "Temperature": _to_float(_get(["temperature", "Temperature"])),
        "Humidity": _to_float(_get(["humidity", "Humidity"])),
        "pH": _to_float(_get(["ph", "pH"])),
        "Rainfall": _to_float(_get(["rainfall", "Rainfall"])),
    }

    return coerced


def predict_crop_from_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    pipeline, meta = get_model()
    features = _coerce_payload(payload)
    df = pd.DataFrame([features])

    try:
        proba = pipeline.predict_proba(df)[0]
        classes = pipeline.named_steps["model"].classes_
        idx = int(np.argmax(proba))
        crop = str(classes[idx]).title()
        confidence = float(proba[idx])
    except Exception:
        crop = str(pipeline.predict(df)[0]).title()
        confidence = 0.0

    return {
        "crop": crop,
        "confidence": round(confidence * 100, 2),
        "meta": {
            "model_accuracy": round(meta.get("accuracy", 0.0) * 100, 2),
            "used_features": features,
        }
    }


