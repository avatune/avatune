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

    ## Architecture
    - MobileNetV2 backbone (transfer learning from ImageNet)
    - Single-phase fine-tuning: last 30 backbone layers
    - ~2.5MB after TFJS uint8 quantization
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
    import json

    print(f"TensorFlow: {tf.__version__}")

    gpus = tf.config.list_physical_devices("GPU")
    if gpus:
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
        print(f"✅ Found {len(gpus)} GPU(s)")
    else:
        print("⚠️  No GPU found, using CPU")

    print(f"🎯 Device: {tf.test.gpu_device_name() or 'CPU'}")
    return Path, json, keras, np


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Configuration
    """)
    return


@app.cell
def _(Path):
    DATA_PATH = Path("./data/fairface-skin")
    MODEL_OUTPUT_PATH = Path("./models/ethnicity")
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


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Data Loading & Augmentation
    """)
    return


@app.cell
def _(DATA_PATH, ETHNICITIES, keras):
    train_datagen = keras.preprocessing.image.ImageDataGenerator(
        rescale=1.0 / 255,
        rotation_range=15,
        width_shift_range=0.1,
        height_shift_range=0.1,
        brightness_range=[0.85, 1.15],
        zoom_range=0.1,
        horizontal_flip=True,
        channel_shift_range=10,
        fill_mode='nearest',
        validation_split=0.2,
    )

    val_datagen = keras.preprocessing.image.ImageDataGenerator(
        rescale=1.0 / 255,
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

    print(f"Training: {train_gen.samples}, Validation: {val_gen.samples}")
    print(f"Class indices: {train_gen.class_indices}")
    return train_gen, val_gen


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Model Architecture
    """)
    return


@app.cell
def _(ETHNICITIES, keras, np, train_gen):
    class_counts = np.bincount(train_gen.classes)
    total = class_counts.sum()
    class_weights = {
        i: total / (len(class_counts) * count) for i, count in enumerate(class_counts)
    }
    print(f"⚖️  Class weights: {class_weights}")

    base_model = keras.applications.MobileNetV2(
        weights="imagenet", include_top=False, input_shape=(128, 128, 3)
    )

    # Phase 1: freeze entire backbone, train head only
    base_model.trainable = False

    inputs = keras.Input(shape=(128, 128, 3))
    x = keras.layers.Rescaling(scale=2.0, offset=-1.0)(inputs)
    x = base_model(x, training=False)
    x = keras.layers.GlobalAveragePooling2D()(x)
    x = keras.layers.Dense(128, activation="relu")(x)
    x = keras.layers.Dropout(0.4)(x)
    outputs = keras.layers.Dense(len(ETHNICITIES), activation="softmax")(x)
    model = keras.Model(inputs, outputs)

    model.compile(
        optimizer=keras.optimizers.legacy.Adam(learning_rate=1e-3),
        loss=keras.losses.CategoricalCrossentropy(label_smoothing=0.1),
        metrics=["accuracy"],
    )

    model.summary()
    return base_model, class_weights, model


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Phase 1: Train Head (Backbone Frozen)
    """)
    return


@app.cell
def _(class_weights, keras, model, train_gen, val_gen):
    print('🚀 Phase 1: Training classification head...\n')

    history_phase1 = model.fit(
        train_gen,
        epochs=10,
        validation_data=val_gen,
        class_weight=class_weights,
        callbacks=[
            keras.callbacks.EarlyStopping(
                monitor="val_accuracy", patience=5,
                restore_best_weights=True, mode="max", verbose=1,
            ),
        ],
        verbose=1,
    )

    print(f'\n✅ Phase 1 complete!')
    print(f'   Best val accuracy: {max(history_phase1.history["val_accuracy"])*100:.2f}%')
    return (history_phase1,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Phase 2: Fine-tune Backbone
    """)
    return


@app.cell
def _(
    MODEL_OUTPUT_PATH,
    base_model,
    class_weights,
    keras,
    model,
    train_gen,
    val_gen,
):
    # Unfreeze last 30 layers for fine-tuning
    base_model.trainable = True
    for layer in base_model.layers[:-30]:
        layer.trainable = False

    model.compile(
        optimizer=keras.optimizers.legacy.Adam(learning_rate=1e-4),
        loss=keras.losses.CategoricalCrossentropy(label_smoothing=0.1),
        metrics=["accuracy"],
    )

    print('🚀 Phase 2: Fine-tuning backbone (last 30 layers)...\n')

    history_phase2 = model.fit(
        train_gen,
        epochs=40,
        validation_data=val_gen,
        class_weight=class_weights,
        callbacks=[
            keras.callbacks.EarlyStopping(
                monitor="val_accuracy", patience=10,
                restore_best_weights=True, mode="max", verbose=1,
            ),
            keras.callbacks.ModelCheckpoint(
                str(MODEL_OUTPUT_PATH / "best_ethnicity_model.keras"),
                monitor="val_accuracy", save_best_only=True,
                mode="max", verbose=1,
            ),
            keras.callbacks.ReduceLROnPlateau(
                monitor="val_loss", factor=0.5, patience=5,
                min_lr=1e-6, verbose=1,
            ),
        ],
        verbose=1,
    )

    print(f'\n✅ Phase 2 complete!')
    print(f'   Best val accuracy: {max(history_phase2.history["val_accuracy"])*100:.2f}%')
    return (history_phase2,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Training History
    """)
    return


@app.cell
def _(history_phase1, history_phase2):
    import matplotlib.pyplot as plt

    val_acc = history_phase1.history['val_accuracy'] + history_phase2.history['val_accuracy']
    _acc = history_phase1.history['accuracy'] + history_phase2.history['accuracy']
    _loss = history_phase1.history['loss'] + history_phase2.history['loss']
    _val_loss = history_phase1.history['val_loss'] + history_phase2.history['val_loss']
    _p1_epochs = len(history_phase1.history['accuracy'])

    _fig, _axes = plt.subplots(1, 2, figsize=(14, 5))

    _axes[0].plot(_acc, label="Train")
    _axes[0].plot(val_acc, label="Val")
    _axes[0].axvline(x=_p1_epochs - 0.5, color='gray', linestyle='--', alpha=0.5, label='Fine-tune start')
    _axes[0].set_title("Accuracy")
    _axes[0].set_xlabel("Epoch")
    _axes[0].legend()

    _axes[1].plot(_loss, label="Train")
    _axes[1].plot(_val_loss, label="Val")
    _axes[1].axvline(x=_p1_epochs - 0.5, color='gray', linestyle='--', alpha=0.5, label='Fine-tune start')
    _axes[1].set_title("Loss")
    _axes[1].set_xlabel("Epoch")
    _axes[1].legend()

    plt.tight_layout()
    plt.show()
    return (plt,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Evaluation
    """)
    return


@app.cell
def _(ETHNICITIES, model, np, val_gen):
    val_loss, val_accuracy = model.evaluate(val_gen, verbose=0)
    print(f"✅ Ethnicity Validation Accuracy: {val_accuracy*100:.1f}%")
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
    return y_pred_classes, y_true


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
    print(f"✅ Skin Tone Accuracy (via ethnicity mapping): {skin_tone_acc*100:.1f}%")
    print()

    print("Per skin tone accuracy:")
    for j, tone_j in enumerate(SKIN_TONES):
        mask_j = y_true_skin == j
        if mask_j.sum() > 0:
            tone_acc = np.mean(y_pred_skin[mask_j] == j)
            print(f"  {tone_j}: {tone_acc*100:.1f}%")
    return y_pred_skin, y_true_skin


@app.cell
def _(
    ETHNICITIES,
    SKIN_TONES,
    np,
    plt,
    y_pred_classes,
    y_pred_skin,
    y_true,
    y_true_skin,
):
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
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ## Convert to TensorFlow.js
    """)
    return


@app.cell
def _(ETHNICITIES, MODEL_OUTPUT_PATH, json, model):
    import tensorflowjs as tfjs

    print('\n' + '=' * 60)
    print('🔄 Converting to TensorFlow.js...')
    print('=' * 60)

    tfjs_path = MODEL_OUTPUT_PATH / "tfjs"
    tfjs_path.mkdir(parents=True, exist_ok=True)

    tfjs.converters.save_keras_model(
        model, str(tfjs_path), quantization_dtype_map={"uint8": "*"}
    )

    with open(tfjs_path / 'classes.json', 'w') as _f:
        json.dump(ETHNICITIES, _f, indent=2)

    print('\n✅ TensorFlow.js conversion complete!')
    print(f'\n📁 Generated files:')

    _total_size = 0
    for _file in sorted(tfjs_path.glob('*')):
        _size = _file.stat().st_size / 1024
        _total_size += _size
        print(f'   - {_file.name}: {_size:.1f} KB')

    print(f'\n📦 Total size: {_total_size:.1f} KB ({_total_size / 1024:.2f} MB)')
    print(f'\n🎯 Ready for deployment!')
    return


if __name__ == "__main__":
    app.run()
