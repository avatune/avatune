import marimo

__generated_with = "0.20.4"
app = marimo.App()


@app.cell
def _():
    import marimo as mo

    return (mo,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    # Ethnicity / Skin Tone Model Validation

    Loads `best_ethnicity_model.keras` and evaluates both ethnicity classification
    accuracy and mapped skin tone accuracy (dark/medium/light).
    Saves results to `validation.json`.
    """)
    return


@app.cell
def _():
    import os
    os.environ["TF_USE_LEGACY_KERAS"] = "1"

    import tensorflow as tf
    from tensorflow import keras
    import numpy as np
    from pathlib import Path
    import matplotlib.pyplot as plt
    import seaborn as sns
    from sklearn.metrics import confusion_matrix, classification_report
    import json
    from datetime import date

    print(f"TensorFlow version: {tf.__version__}")
    return (
        Path,
        classification_report,
        confusion_matrix,
        date,
        json,
        keras,
        np,
        plt,
        sns,
        tf,
    )


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Configuration
    """)
    return


@app.cell
def _(Path):
    DATA_PATH = Path("./data/fairface-skin")
    MODEL_PATH = Path("./models/ethnicity/best_ethnicity_model.keras")
    OUTPUT_PATH = Path("./models/ethnicity")

    ETHNICITIES = sorted([d.name for d in DATA_PATH.iterdir() if d.is_dir()])
    print(f"Ethnicities: {ETHNICITIES}")

    ETHNICITY_TO_SKIN_TONE = {
        "black": "dark",
        "east_asian": "light",
        "indian": "medium",
        "latino_hispanic": "medium",
        "middle_eastern": "medium",
        "southeast_asian": "medium",
        "white": "light",
    }

    SKIN_TONES = ["dark", "light", "medium"]

    print(f"Skin tones: {SKIN_TONES}")
    return (
        DATA_PATH,
        ETHNICITIES,
        ETHNICITY_TO_SKIN_TONE,
        MODEL_PATH,
        OUTPUT_PATH,
        SKIN_TONES,
    )


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Load Model
    """)
    return


@app.cell
def _(MODEL_PATH, tf):
    model = tf.keras.models.load_model(MODEL_PATH)
    print(f"Loaded model from {MODEL_PATH}")
    print(f"Parameters: {model.count_params():,}")
    return (model,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Load Validation Data
    """)
    return


@app.cell
def _(DATA_PATH, ETHNICITIES, keras):
    val_datagen = keras.preprocessing.image.ImageDataGenerator(
        rescale=1.0 / 255,
        validation_split=0.2,
    )

    val_gen = val_datagen.flow_from_directory(
        DATA_PATH,
        target_size=(128, 128),
        batch_size=64,
        class_mode="categorical",
        classes=ETHNICITIES,
        subset="validation",
        seed=42,
        shuffle=False,
    )

    print(f"Validation: {val_gen.samples} images")
    return (val_gen,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Ethnicity Evaluation
    """)
    return


@app.cell
def _(ETHNICITIES, classification_report, model, np, val_gen):
    val_gen.reset()
    y_pred = model.predict(val_gen, verbose=0)
    y_pred_classes = np.argmax(y_pred, axis=1)
    y_true = val_gen.classes

    ethnicity_accuracy = float(np.mean(y_true == y_pred_classes))
    print(f'Ethnicity Validation Accuracy: {ethnicity_accuracy * 100:.2f}%\n')

    print(classification_report(
        y_true, y_pred_classes,
        target_names=ETHNICITIES, zero_division=0
    ))

    per_ethnicity_acc = {}
    for i, name in enumerate(ETHNICITIES):
        mask_i = y_true == i
        if mask_i.sum() > 0:
            class_acc = float(np.mean(y_pred_classes[mask_i] == i))
            per_ethnicity_acc[name] = round(class_acc, 4)
            print(f'  {name}: {class_acc * 100:.1f}%')

    return ethnicity_accuracy, per_ethnicity_acc, y_pred_classes, y_true


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Skin Tone Evaluation (Mapped)
    """)
    return


@app.cell
def _(
    ETHNICITIES,
    ETHNICITY_TO_SKIN_TONE,
    SKIN_TONES,
    np,
    y_pred_classes,
    y_true,
):
    y_true_skin = np.array(
        [SKIN_TONES.index(ETHNICITY_TO_SKIN_TONE[ETHNICITIES[i]]) for i in y_true]
    )
    y_pred_skin = np.array(
        [SKIN_TONES.index(ETHNICITY_TO_SKIN_TONE[ETHNICITIES[i]]) for i in y_pred_classes]
    )

    skin_tone_accuracy = float(np.mean(y_true_skin == y_pred_skin))
    print(f'Skin Tone Accuracy (via ethnicity mapping): {skin_tone_accuracy * 100:.1f}%\n')

    per_skin_tone_acc = {}
    for j, tone in enumerate(SKIN_TONES):
        mask_j = y_true_skin == j
        if mask_j.sum() > 0:
            tone_acc = float(np.mean(y_pred_skin[mask_j] == j))
            per_skin_tone_acc[tone] = round(tone_acc, 4)
            print(f'  {tone}: {tone_acc * 100:.1f}%')

    return per_skin_tone_acc, skin_tone_accuracy, y_pred_skin, y_true_skin


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Confusion Matrices
    """)
    return


@app.cell
def _(
    ETHNICITIES,
    SKIN_TONES,
    confusion_matrix,
    np,
    plt,
    sns,
    y_pred_classes,
    y_pred_skin,
    y_true,
    y_true_skin,
):
    _fig, _axes = plt.subplots(1, 2, figsize=(14, 5))

    _cm_eth = confusion_matrix(y_true, y_pred_classes)
    _cm_eth_norm = _cm_eth.astype("float") / _cm_eth.sum(axis=1)[:, np.newaxis]

    sns.heatmap(
        _cm_eth_norm, annot=True, fmt=".2f", cmap="Blues",
        xticklabels=ETHNICITIES, yticklabels=ETHNICITIES, ax=_axes[0],
    )
    _axes[0].set_title("Ethnicity Confusion Matrix")
    _axes[0].set_ylabel("True")
    _axes[0].set_xlabel("Predicted")
    _axes[0].tick_params(axis="x", rotation=45)
    _axes[0].tick_params(axis="y", rotation=0)

    _cm_skin = confusion_matrix(y_true_skin, y_pred_skin)
    _cm_skin_norm = _cm_skin.astype("float") / _cm_skin.sum(axis=1)[:, np.newaxis]

    sns.heatmap(
        _cm_skin_norm, annot=True, fmt=".2f", cmap="Blues",
        xticklabels=SKIN_TONES, yticklabels=SKIN_TONES, ax=_axes[1],
    )
    _axes[1].set_title("Skin Tone Confusion Matrix (mapped)")
    _axes[1].set_ylabel("True")
    _axes[1].set_xlabel("Predicted")

    plt.tight_layout()
    plt.show()
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Save Validation Results
    """)
    return


@app.cell
def _(
    MODEL_PATH,
    OUTPUT_PATH,
    date,
    ethnicity_accuracy,
    json,
    per_ethnicity_acc,
    per_skin_tone_acc,
    skin_tone_accuracy,
):
    results = {
        'ethnicity_accuracy': round(ethnicity_accuracy, 4),
        'per_ethnicity_accuracy': per_ethnicity_acc,
        'skin_tone_accuracy': round(skin_tone_accuracy, 4),
        'per_skin_tone_accuracy': per_skin_tone_acc,
        'model_file': MODEL_PATH.name,
        'date': str(date.today()),
    }

    output_file = OUTPUT_PATH / 'validation.json'
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)

    print(f'Saved validation results to {output_file}')
    print(json.dumps(results, indent=2))
    return


if __name__ == "__main__":
    app.run()
