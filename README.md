Environment Setup

pip install -r requirements.txt

Dataset Preparation
Download ACNE04 dataset.
Organize images according to severity labels.
Update dataset path in notebook configuration.
Training

Run:
Acne-01.pynb

Select desired iteration configuration.

Evaluation

Execute evaluation cells in notebook.

Outputs:

Accuracy
Precision
Recall
F1
ROC-AUC
Confusion Matrix
Inference

Input:

Single facial image

Output:

Acne Severity Class

Planned.

Not implemented in final development version.

Final Architecture

ResNet50 Hybrid Multi-Task Learning

Components:

Severity Classification Head
Lesion Count Regression Head
Final Dataset

ACNE04

Images:

1457

Classes:

Mild
Moderate
Severe
Very Severe
Final Test Results

Accuracy:
75.00%

Precision:
75.15%

Recall:
75.00%

F1 Score:
74.11%

ROC-AUC:
0.9105

Why This Model Was Selected

Compared with all previous iterations:

Highest Accuracy
Highest Precision
Highest F1 Score
Strongest ROC-AUC
Best minority-class handling
Model Checkpoint

Checkpoint File:
Not Included in Handover Package

Status:
Must be exported separately from training environment.

Model Size

Not Recorded

Estimated:
Depends on final serialization format.

Inference Time

Not formally benchmarked.

Status:
Not Recorded

Minimum Requirements

CPU:

4 Core Recommended

RAM:

8 GB Recommended

GPU:

Optional


✓ Acne Severity Classification

✓ Lesion Count Estimation

✓ Confidence Probabilities (Softmax Outputs)

✓ Severity Category Prediction

Not Implemented

✗ Bounding Boxes

✗ Acne Segmentation

✗ Acne Heatmaps

✗ Face Detection

✗ Image Quality Validation

✗ Refusal Detection Pipeline

✗ Explainability Dashboard

✗ Clinical Report Generation

Known Limitations
Class imbalance
Limited severe acne samples
Limited skin-tone diversity
No lesion localization
No image quality assessment
Performance not validated across ethnic groups
