"""
Skincare recommendation engine for the Acne Severity Classification System.
Maps severity classes to detailed, AI-generated skincare recommendations.
"""


# Severity classes matching model output order
SEVERITY_CLASSES = [
    "Mild Acne",
    "Moderate Acne",
    "Severe Acne",
    "Very Severe Acne"
]


# Detailed recommendations for each severity class
RECOMMENDATIONS = {
    "Clear Skin": {
        "summary": "Your skin appears clear with no significant acne detected.",
        "tips": [
            "Continue your current skincare routine — it's working well.",
            "Use a gentle, pH-balanced cleanser twice daily.",
            "Apply a broad-spectrum SPF 30+ sunscreen every morning.",
            "Stay hydrated and maintain a balanced diet rich in antioxidants.",
            "Avoid touching your face frequently to prevent bacterial transfer."
        ],
        "products": "Gentle foaming cleanser, lightweight moisturizer, SPF 30+ sunscreen.",
        "urgency": "low"
    },
    "Mild Acne": {
        "summary": "Mild acne detected. Minor blemishes that can typically be managed with over-the-counter treatments.",
        "tips": [
            "Use a salicylic acid (2%) or benzoyl peroxide (2.5%) cleanser.",
            "Apply a non-comedogenic moisturizer after cleansing.",
            "Consider using a retinoid product at night (start with low concentration).",
            "Avoid picking or squeezing blemishes to prevent scarring.",
            "Change pillowcases frequently and keep hair away from face."
        ],
        "products": "Salicylic acid cleanser, benzoyl peroxide spot treatment, oil-free moisturizer.",
        "urgency": "low"
    },
    "Moderate Acne": {
        "summary": "Moderate acne detected. Multiple blemishes present that may benefit from a more targeted treatment approach.",
        "tips": [
            "Use a combination of benzoyl peroxide and salicylic acid products.",
            "Consider adding a topical retinoid (adapalene 0.1%) to your nighttime routine.",
            "Use a gentle, non-foaming cleanser to avoid over-drying the skin.",
            "Apply niacinamide serum to reduce inflammation and redness.",
            "Consult a dermatologist if symptoms persist after 6-8 weeks of treatment."
        ],
        "products": "Adapalene gel, niacinamide serum, gentle cleanser, oil-free SPF moisturizer.",
        "urgency": "medium"
    },
    "Severe Acne": {
        "summary": "Severe acne detected. Significant inflammation present. Professional dermatological consultation is strongly recommended.",
        "tips": [
            "Schedule an appointment with a board-certified dermatologist.",
            "Avoid harsh scrubs or exfoliants that can worsen inflammation.",
            "Use a very gentle, fragrance-free cleanser.",
            "Apply prescribed topical treatments as directed by your dermatologist.",
            "Consider discussing oral medications or combination therapy with your doctor.",
            "Do not attempt to pop or extract lesions — this can cause permanent scarring."
        ],
        "products": "Prescription-strength treatments as recommended by your dermatologist.",
        "urgency": "high"
    },
    "Very Severe Acne": {
        "summary": "Very severe acne detected. Extensive inflammation and potential for scarring. Immediate professional medical attention is recommended.",
        "tips": [
            "Seek immediate consultation with a dermatologist or skincare specialist.",
            "Your dermatologist may recommend isotretinoin (Accutane) or other systemic treatments.",
            "Avoid all harsh products — use only ultra-gentle, dermatologist-approved cleansers.",
            "Do not pick, squeeze, or touch affected areas.",
            "Follow your dermatologist's treatment plan strictly for best results.",
            "Consider discussing hormonal evaluation if applicable.",
            "Mental health support is available if acne is affecting your well-being."
        ],
        "products": "Dermatologist-prescribed systemic and topical treatments only.",
        "urgency": "critical"
    }
}


def get_recommendation(predicted_class):
    """
    Get skincare recommendation based on the predicted severity class.
    
    Args:
        predicted_class (str): The predicted acne severity class.
        
    Returns:
        dict: Recommendation data including summary, tips, products, and urgency.
    """
    if predicted_class in RECOMMENDATIONS:
        return RECOMMENDATIONS[predicted_class]
    
    # Fallback recommendation
    return {
        "summary": "Unable to determine specific recommendations. Please consult a dermatologist.",
        "tips": ["Consult a board-certified dermatologist for personalized advice."],
        "products": "Consult your dermatologist.",
        "urgency": "medium"
    }


def get_severity_index(predicted_class):
    """
    Get the severity index (0-4) for a predicted class.
    
    Args:
        predicted_class (str): The predicted acne severity class.
        
    Returns:
        int: Severity index from 0 (clear) to 4 (very severe).
    """
    try:
        return SEVERITY_CLASSES.index(predicted_class)
    except ValueError:
        return -1
