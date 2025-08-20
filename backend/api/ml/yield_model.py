import os
from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_PATH = BASE_DIR / 'data' / 'crop_production.csv'
MODEL_DIR = Path(__file__).resolve().parent
MODEL_PATH = MODEL_DIR / 'yield_model.joblib'

CATEGORICAL_FEATURES = ['crop', 'season']
NUMERIC_FEATURES = ['year']
TARGET_COLUMN = 'yield_per_ha'


def _standardize_columns(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = [c.strip().lower().replace(' ', '_') for c in df.columns]
    # Common variants
    rename_map = {
        'state_name': 'state',
        'district_name': 'district',
    }
    df.rename(columns={k: v for k, v in rename_map.items() if k in df.columns}, inplace=True)
    return df


def _clean_and_engineer(df: pd.DataFrame) -> pd.DataFrame:
    df = _standardize_columns(df)

    # Ensure required columns exist
    required_cols = []
    # Production & Area columns can have different cases
    prod_col = 'production' if 'production' in df.columns else None
    area_col = 'area' if 'area' in df.columns else None
    crop_col = 'crop' if 'crop' in df.columns else None
    season_col = 'season' if 'season' in df.columns else None
    year_col = 'year' if 'year' in df.columns else None

    for name, col in [('production', prod_col), ('area', area_col), ('crop', crop_col), ('season', season_col), ('year', year_col)]:
        if col is None:
            raise ValueError(f"Missing required column: {name}")
        required_cols.append(col)

    df = df[required_cols].copy()

    # Basic cleaning
    df = df.dropna()
    # Keep valid positives
    df = df[(df[area_col] > 0) & (df[prod_col] >= 0)]

    # Compute yield per hectare; production is often in tonnes; convert to kg if needed
    # If units unknown, model learns relative mapping; we keep as production/area
    df[TARGET_COLUMN] = df[prod_col] / df[area_col]

    # Remove extreme outliers (1st-99th percentiles)
    low, high = df[TARGET_COLUMN].quantile([0.01, 0.99])
    df = df[(df[TARGET_COLUMN] >= low) & (df[TARGET_COLUMN] <= high)]

    # Normalize categorical values
    df['crop'] = df[crop_col].astype(str).str.strip().str.lower()
    df['season'] = df[season_col].astype(str).str.strip().str.title()
    df['year'] = df[year_col].astype(int)

    return df[[*CATEGORICAL_FEATURES, *NUMERIC_FEATURES, TARGET_COLUMN]].reset_index(drop=True)


def _build_pipeline() -> Pipeline:
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), CATEGORICAL_FEATURES),
            ('num', StandardScaler(), NUMERIC_FEATURES),
        ]
    )

    model = RandomForestRegressor(
        n_estimators=300,
        max_depth=None,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
    )

    pipeline = Pipeline(steps=[
        ('preprocess', preprocessor),
        ('regressor', model)
    ])
    return pipeline


def train_and_save(force: bool = False) -> dict:
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Dataset not found at {DATA_PATH}")

    if MODEL_PATH.exists() and not force:
        return {"status": "exists", "model_path": str(MODEL_PATH)}

    df = pd.read_csv(DATA_PATH)
    df_clean = _clean_and_engineer(df)

    X = df_clean[[*CATEGORICAL_FEATURES, *NUMERIC_FEATURES]]
    y = df_clean[TARGET_COLUMN]

    pipeline = _build_pipeline()
    pipeline.fit(X, y)

    # Persist pipeline and basic metadata
    metadata = {
        'features': [*CATEGORICAL_FEATURES, *NUMERIC_FEATURES],
        'target': TARGET_COLUMN,
        'rows': int(len(df_clean)),
    }

    joblib.dump({
        'pipeline': pipeline,
        'metadata': metadata,
    }, MODEL_PATH)

    return {"status": "trained", "rows": metadata['rows'], "model_path": str(MODEL_PATH)}


def _load_artifacts():
    if not MODEL_PATH.exists():
        train_and_save(force=True)
    bundle = joblib.load(MODEL_PATH)
    return bundle['pipeline'], bundle['metadata']


def predict_yield(crop: str, season: str, year: int, area: float) -> dict:
    pipeline, _ = _load_artifacts()

    crop = str(crop).strip().lower()
    season = str(season).strip().title()
    year = int(year)
    area = float(area)
    if area <= 0:
        raise ValueError('Area must be > 0')

    X = pd.DataFrame([{ 'crop': crop, 'season': season, 'year': year }])
    yield_per_ha = float(pipeline.predict(X)[0])

    total_yield = float(yield_per_ha * area)
    quintals_per_ha = yield_per_ha / 0.1 if yield_per_ha is not None else None  # 1 quintal = 100 kg

    return {
        'yieldPerHa': round(yield_per_ha, 2),
        'totalYield': round(total_yield, 2),
        'quintalsPerHa': round(quintals_per_ha, 2) if quintals_per_ha is not None else None,
    }
