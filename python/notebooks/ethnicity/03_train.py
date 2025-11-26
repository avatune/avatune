import marimo

__generated_with = "0.17.2"
app = marimo.App()


@app.cell(hide_code=True)
def _(mo):
    mo.md(
        r"""
    # Ethnicity Classification with MobileNetV2

    Train an ethnicity classifier on FairFace data, then map to skin tone categories.

    ## Why Ethnicity Instead of Direct Skin Tone?
    FairFace skin tone labels are extremely noisy - ITA analysis shows all 3 classes
    (dark/medium/light) span the entire possible range. Direct skin tone classification
    hits a ceiling of ~50% accuracy due to label noise.

    Ethnicity labels are cleaner and more learnable. We can then map:
    - **Dark**: black
    - **Medium**: indian, latino_hispanic, middle_eastern, southeast_asian
    - **Light**: white, east_asian

    ## TensorFlow Metal
    This notebook uses TensorFlow Metal for GPU acceleration on Apple Silicon.
    """
    )
    return


@app.cell
def _():
    import os

    os.environ["TF_USE_LEGACY_KERAS"] = "1"

    import tensorflow as tf
    from tensorflow import keras
    import numpy as np
    from pathlib import Path
    import json

    print(f"TensorFlow: {tf.__version__}")

    gpus = tf.config.list_physical_devices("GPU")
    if gpus:
        print(f"GPU devices: {gpus}")
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
    else:
        print("No GPU found - training on CPU")
    return Path, json, keras, np


@app.cell
def _(Path):
    DATA_PATH = Path("./data/fairface-skin")
    MODEL_OUTPUT_PATH = Path("./models/ethnicicty")
    MODEL_OUTPUT_PATH.mkdir(exist_ok=True)

    ETHNICITIES = sorted([d.name for d in DATA_PATH.iterdir() if d.is_dir()])
    print(f"Ethnicities: {ETHNICITIES}")

    for eth in ETHNICITIES:
        count = len(list((DATA_PATH / eth).glob("*.jpg")))
        print(f"  {eth}: {count}")

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

    print()
    print("Ethnicity -> Skin Tone mapping:")
    for eth, tone in ETHNICITY_TO_SKIN_TONE.items():
        print(f"  {eth} -> {tone}")
    return (
        DATA_PATH,
        ETHNICITIES,
        ETHNICITY_TO_SKIN_TONE,
        MODEL_OUTPUT_PATH,
        SKIN_TONES,
    )


@app.cell
def _(DATA_PATH, ETHNICITIES, keras):
    train_datagen = keras.preprocessing.image.ImageDataGenerator(
        rescale=1.0 / 255,
        rotation_range=10,
        width_shift_range=0.1,
        height_shift_range=0.1,
        horizontal_flip=True,
        validation_split=0.2,
    )

    train_gen = train_datagen.flow_from_directory(
        DATA_PATH,
        target_size=(128, 128),
        batch_size=64,
        class_mode="categorical",
        classes=ETHNICITIES,
        subset="training",
        seed=42,
    )

    val_gen = train_datagen.flow_from_directory(
        DATA_PATH,
        target_size=(128, 128),
        batch_size=64,
        class_mode="categorical",
        classes=ETHNICITIES,
        subset="validation",
        seed=42,
        shuffle=False,
    )

    print(f"Training: {train_gen.samples}, Validation: {val_gen.samples}")
    print(f"Class indices: {train_gen.class_indices}")
    return train_gen, val_gen


@app.cell
def _(ETHNICITIES, keras, np, train_gen):
    class_counts = np.bincount(train_gen.classes)
    total = class_counts.sum()
    class_weights = {
        i: total / (len(class_counts) * count) for i, count in enumerate(class_counts)
    }
    print(f"Class weights: {class_weights}")

    base_model = keras.applications.MobileNetV2(
        weights="imagenet", include_top=False, input_shape=(128, 128, 3)
    )

    for layer in base_model.layers[:-30]:
        layer.trainable = False
    for layer in base_model.layers[-30:]:
        layer.trainable = True

    model = keras.Sequential(
        [
            base_model,
            keras.layers.GlobalAveragePooling2D(),
            keras.layers.Dense(128, activation="relu"),
            keras.layers.Dropout(0.4),
            keras.layers.Dense(len(ETHNICITIES), activation="softmax"),
        ]
    )

    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.0001),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    model.summary()
    return class_weights, model


@app.cell
def _(class_weights, keras, model, train_gen, val_gen):
    history = model.fit(
        train_gen,
        epochs=15,
        validation_data=val_gen,
        class_weight=class_weights,
        callbacks=[
            keras.callbacks.EarlyStopping(
                monitor="val_accuracy", patience=5, restore_best_weights=True, mode="max"
            ),
            keras.callbacks.ReduceLROnPlateau(
                monitor="val_loss", factor=0.5, patience=3
            ),
        ],
        verbose=1,
    )
    return (history,)


@app.cell
def _(ETHNICITIES, model, np, val_gen):
    val_loss, val_acc = model.evaluate(val_gen, verbose=0)
    print(f"Ethnicity Validation Accuracy: {val_acc*100:.1f}%")
    print()

    val_gen.reset()
    y_pred = model.predict(val_gen, verbose=0)
    y_pred_classes = np.argmax(y_pred, axis=1)
    y_true = val_gen.classes

    print("Per-ethnicity accuracy:")
    for i, name in enumerate(ETHNICITIES):
        mask = y_true == i
        if mask.sum() > 0:
            class_acc = np.mean(y_pred_classes[mask] == i)
            print(f"  {name}: {class_acc*100:.1f}%")
    return val_acc, y_pred_classes, y_true


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
        [
            SKIN_TONES.index(ETHNICITY_TO_SKIN_TONE[ETHNICITIES[i]])
            for i in y_pred_classes
        ]
    )

    skin_tone_acc = np.mean(y_true_skin == y_pred_skin)
    print(f"Skin Tone Accuracy (via ethnicity mapping): {skin_tone_acc*100:.1f}%")
    print()

    print("Per skin tone accuracy:")
    for j, tone_j in enumerate(SKIN_TONES):
        mask_j = y_true_skin == j
        if mask_j.sum() > 0:
            tone_acc = np.mean(y_pred_skin[mask_j] == j)
            print(f"  {tone_j}: {tone_acc*100:.1f}%")
    return skin_tone_acc, y_pred_skin, y_true_skin


@app.cell
def _(
    ETHNICITIES,
    SKIN_TONES,
    np,
    y_pred_classes,
    y_pred_skin,
    y_true,
    y_true_skin,
):
    import matplotlib.pyplot as plt
    import seaborn as sns
    from sklearn.metrics import confusion_matrix

    fig, axes = plt.subplots(1, 2, figsize=(14, 5))

    cm_eth = confusion_matrix(y_true, y_pred_classes)
    cm_eth_norm = cm_eth.astype("float") / cm_eth.sum(axis=1)[:, np.newaxis]

    sns.heatmap(
        cm_eth_norm,
        annot=True,
        fmt=".2f",
        cmap="Blues",
        xticklabels=ETHNICITIES,
        yticklabels=ETHNICITIES,
        ax=axes[0],
    )
    axes[0].set_title("Ethnicity Confusion Matrix")
    axes[0].set_ylabel("True")
    axes[0].set_xlabel("Predicted")
    axes[0].tick_params(axis="x", rotation=45)
    axes[0].tick_params(axis="y", rotation=0)

    cm_skin = confusion_matrix(y_true_skin, y_pred_skin)
    cm_skin_norm = cm_skin.astype("float") / cm_skin.sum(axis=1)[:, np.newaxis]

    sns.heatmap(
        cm_skin_norm,
        annot=True,
        fmt=".2f",
        cmap="Blues",
        xticklabels=SKIN_TONES,
        yticklabels=SKIN_TONES,
        ax=axes[1],
    )
    axes[1].set_title("Skin Tone Confusion Matrix (mapped)")
    axes[1].set_ylabel("True")
    axes[1].set_xlabel("Predicted")

    plt.tight_layout()
    plt.show()
    return (plt,)


@app.cell
def _(history, plt):
    fig2, axes2 = plt.subplots(1, 2, figsize=(12, 4))

    axes2[0].plot(history.history["accuracy"], label="Train")
    axes2[0].plot(history.history["val_accuracy"], label="Val")
    axes2[0].set_title("Accuracy")
    axes2[0].set_xlabel("Epoch")
    axes2[0].legend()

    axes2[1].plot(history.history["loss"], label="Train")
    axes2[1].plot(history.history["val_loss"], label="Val")
    axes2[1].set_title("Loss")
    axes2[1].set_xlabel("Epoch")
    axes2[1].legend()

    plt.tight_layout()
    plt.show()
    return


@app.cell
def _(ETHNICITIES, MODEL_OUTPUT_PATH, json, model):
    model.save(MODEL_OUTPUT_PATH / "ethnicity.keras")

    with open(MODEL_OUTPUT_PATH / "ethnicity_classes.json", "w") as f:
        json.dump(ETHNICITIES, f)

    print(f"Saved model to {MODEL_OUTPUT_PATH / 'ethnicity.keras'}")
    print(f"Saved classes to {MODEL_OUTPUT_PATH / 'ethnicity_classes.json'}")
    return


@app.cell
def _(mo):
    mo.md(
        r"""
    ## Convert to TensorFlow.js

    For browser inference.
    """
    )
    return


@app.cell
def _(MODEL_OUTPUT_PATH, model):
    import tensorflowjs as tfjs

    tfjs_path = MODEL_OUTPUT_PATH / "tfjs"
    tfjs_path.mkdir(parents=True, exist_ok=True)

    tfjs.converters.save_keras_model(
        model, str(tfjs_path), quantization_dtype_map={"uint8": "*"}
    )

    print(f"Converted to TensorFlow.js at {tfjs_path}")
    return


@app.cell
def _():
    import marimo as mo
    return (mo,)


if __name__ == "__main__":
    app.run()
